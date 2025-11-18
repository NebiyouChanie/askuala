import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'

// Public: list instructors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = (searchParams.get('search') || '').trim()
    const offset = (page - 1) * limit

    const whereParts: string[] = ["i.status = 'active'"]
    const params: any[] = []
    if (search) {
      whereParts.push('(i.first_name LIKE ? OR i.last_name LIKE ? OR i.email LIKE ? OR i.bio LIKE ?)')
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
    }
    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : ''

    const countSql = `SELECT COUNT(*) as total FROM instructors i ${whereClause}`
    const countRow = await queryOne<{ total: number }>(countSql, params)
    const total = countRow?.total || 0

    const listSql = `SELECT 
        i.instructor_id,
        i.first_name,
        i.last_name,
        i.bio,
        i.average_rating,
        i.rating_count,
        i.years_experience,
        i.hourly_rate_etb,
        i.courses,
        i.cv_path
      FROM instructors i
      ${whereClause}
      ORDER BY i.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`
    const rows = await query(listSql, params)

    return NextResponse.json({ success: true, data: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    console.error('Error listing public instructors:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}










