import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const admin = createAdminClient()
  const url = new URL(req.url)
  const status = url.searchParams.get('status')
  const department = url.searchParams.get('department')
  const tag = url.searchParams.get('tag')

  let query = admin.from('issues').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  if (department) {
    // join via assignments
    const { data: assigns } = await admin.from('assignments').select('issue_id').eq('department_id', Number(department))
    const ids = assigns?.map((a) => a.issue_id) || []
    if (ids.length) query = query.in('id', ids)
    else return NextResponse.json([])
  }
  if (tag) query = query.contains('tags', [tag])

  const { data, error } = await query.limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

