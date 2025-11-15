import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

async function requireAdmin() {
  const token = (await cookies()).get('session')?.value
  if (!token) return false
  try {
    const payload: any = await decrypt(token)
    return payload?.role === 'admin'
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await requireAdmin()
    if (!isAdmin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const totalRow = await queryOne<{ total: number }>('SELECT COUNT(*) as total FROM feedbacks')
    const total = totalRow?.total || 0

    const rows = await query<any>(
      `SELECT feedback_id, name, email, message, created_at
       FROM feedbacks
       ORDER BY created_at DESC
       LIMIT ${limit} OFFSET ${offset}`
    )

    return NextResponse.json({ success: true, data: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (e) {
    console.error('Feedback list error:', e)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}








