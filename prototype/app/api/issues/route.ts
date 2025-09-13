import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Simple Turnstile verification helper
async function verifyTurnstile(token?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // allow during local dev if not configured
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    })
    const data = await res.json()
    return !!data.success
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const admin = createAdminClient()

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const {
    description,
    flagged = false,
    tags = [],
    latitude,
    longitude,
    images = [],
    reporterEmail,
    turnstileToken,
  } = body

  if (
    typeof description !== 'string' ||
    typeof latitude !== 'number' ||
    typeof longitude !== 'number'
  ) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
  }

  // Verify Turnstile for anonymous submissions
  const ok = await verifyTurnstile(turnstileToken)
  if (!ok) return NextResponse.json({ error: 'Bot verification failed' }, { status: 400 })

  // Insert issue
  const { data: issue, error } = await admin
    .from('issues')
    .insert([{ description, flagged, tags, latitude, longitude, reporter_email: reporterEmail ?? null }])
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Insert images
  if (Array.isArray(images) && images.length) {
    const rows = images.map((url: string) => ({ issue_id: issue.id, url }))
    const { error: imgErr } = await admin.from('issue_images').insert(rows)
    if (imgErr) console.error('Image insert error', imgErr)
  }

  // Route assignment via RPC
  const { data: region, error: routeErr } = await admin.rpc('route_issue_by_point', {
    in_lng: longitude,
    in_lat: latitude,
  })
  if (!routeErr && region && region.department_id) {
    // Upsert-like behavior: try insert; if conflict, ignore
    const { error: assignErr } = await admin
      .from('assignments')
      .insert([{ issue_id: issue.id, department_id: region.department_id }])
    if (assignErr && !assignErr.message.toLowerCase().includes('duplicate')) {
      console.error('Assignment insert error', assignErr)
    }
  }

  // Basic anonymous dedupe support: store hashed IP on votes when voting later

  return NextResponse.json({ id: issue.id })
}

