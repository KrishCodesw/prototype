import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@supabase/supabase-js'

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const statusFilter = searchParams.get('status')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
  )
  
  try {
    let query = supabase
      .from('issues')
      .select(`
        *,
        images:issue_images(url),
        votes(count),
        status_changes:status_history(
          from_status,
          to_status,
          changed_at,
          notes,
          changed_by,
          profiles!status_history_changed_by_fkey(display_name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }
    
    const { data: issues, error } = await query
    
    if (error) {
      console.error('Issues fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 })
    }
    
    // Process vote counts to be numbers instead of objects
    const processedIssues = (issues || []).map(issue => ({
      ...issue,
      vote_count: issue.votes?.[0]?.count || 0
    }))
    
    return NextResponse.json(processedIssues)
  } catch (error) {
    console.error('Issues error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

