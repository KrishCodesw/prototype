import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  
  try {
    // Check if user is admin/official
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || !['admin', 'official'].includes(profile.role)) {
      return NextResponse.json({ error: 'Access denied - Admin/Official access required' }, { status: 403 })
    }

    // Get departments with statistics
    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .select(`
        *,
        issues_count:issues(count),
        officials_count:profiles(count),
        regions_count:regions(count),
        assignments_count:assignments(count)
      `)
      .order('name')

    if (deptError) {
      console.error('Departments fetch error:', deptError)
      return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 })
    }

    return NextResponse.json(departments || [])
    
  } catch (error) {
    console.error('Admin departments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  try {
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Department name is required' }, { status: 400 })
    }

    // Insert department
    const { data: department, error: insertError } = await supabase
      .from('departments')
      .insert({ name, description })
      .select()
      .single()

    if (insertError) {
      if (insertError.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'Department with this name already exists' }, { status: 400 })
      }
      console.error('Department insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create department' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Department created successfully',
      department
    })
    
  } catch (error) {
    console.error('Create department error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  
  try {
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { id, name, description } = body

    if (!id || !name) {
      return NextResponse.json({ error: 'Department ID and name are required' }, { status: 400 })
    }

    // Update department
    const { data: department, error: updateError } = await supabase
      .from('departments')
      .update({ name, description })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      if (updateError.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'Department with this name already exists' }, { status: 400 })
      }
      console.error('Department update error:', updateError)
      return NextResponse.json({ error: 'Failed to update department' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Department updated successfully',
      department
    })
    
  } catch (error) {
    console.error('Update department error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  
  try {
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied - Admin access required' }, { status: 403 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Department ID is required' }, { status: 400 })
    }

    // Check if department has active assignments or officials
    const { data: hasAssignments, error: assignError } = await supabase
      .from('assignments')
      .select('id')
      .eq('department_id', id)
      .limit(1)

    if (assignError) {
      console.error('Assignment check error:', assignError)
      return NextResponse.json({ error: 'Failed to check department usage' }, { status: 500 })
    }

    if (hasAssignments && hasAssignments.length > 0) {
      return NextResponse.json({ error: 'Cannot delete department with active assignments' }, { status: 400 })
    }

    // Delete department
    const { error: deleteError } = await supabase
      .from('departments')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Department delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Department deleted successfully'
    })
    
  } catch (error) {
    console.error('Delete department error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
