import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const supabase = await createClient()
  const pathname = new URL(req.url).pathname
  const idStr = pathname.split('/').pop() || ''
  const id = Number(idStr)
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { data: issue, error } = await supabase.from('issues').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })

  const { data: images } = await supabase.from('issue_images').select('*').eq('issue_id', id)
  const { data: votes } = await supabase.from('votes').select('id').eq('issue_id', id)
  const { data: history } = await supabase.from('status_history').select('*').eq('issue_id', id).order('changed_at', { ascending: false })
  const { data: assignment } = await supabase.from('assignments').select('*').eq('issue_id', id).single()

  return NextResponse.json({ issue, images, votes: votes?.length ?? 0, history, assignment })
}

