import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query, queryOne, create } from '@/lib/db'

const InstructorCreateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  courses: z.array(z.any()).min(1),
  bio: z.string().optional().nullable(),
  yearsExperience: z.number().int().min(0).max(100).optional().nullable(),
  hourlyRateEtb: z.number().int().min(0).optional().nullable(),
  status: z.enum(['active','inactive','suspended']).optional().default('active'),
  cvPath: z.string().optional().nullable(),
})

// GET /api/admin/instructors - list instructors with user info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = (searchParams.get('search') || '').trim()
    const offset = (page - 1) * limit

    const whereParts: string[] = []
    const params: any[] = []
    if (search) {
      whereParts.push('(i.first_name LIKE ? OR i.last_name LIKE ? OR i.email LIKE ?)')
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }
    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : ''

    const countSql = `SELECT COUNT(*) as total FROM instructors i ${whereClause}`
    const countRow = await queryOne<{ total: number }>(countSql, params)
    const total = countRow?.total || 0

    const listSql = `SELECT 
        i.instructor_id,
        i.first_name,
        i.last_name,
        i.email,
        i.phone,
        i.address,
        i.average_rating,
        i.rating_count,
        i.courses,
        i.bio,
        i.years_experience,
        i.hourly_rate_etb,
        i.cv_path,
        i.status,
        i.created_at,
        i.updated_at
      FROM instructors i
      ${whereClause}
      ORDER BY i.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`
    const rows = await query(listSql, params)

    return NextResponse.json({ success: true, data: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    console.error('Error listing instructors:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/instructors - create instructor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = InstructorCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const data = parsed.data

    // Duplicate checks
    if (data.email || data.phone) {
      const dupSql = `SELECT instructor_id FROM instructors WHERE (email = ? OR (phone IS NOT NULL AND phone = ?)) LIMIT 1`
      const dup = await queryOne<{ instructor_id: string }>(dupSql, [data.email, data.phone ?? ''])
      if (dup) {
        return NextResponse.json({ success: false, error: 'Instructor with this email or phone already exists' }, { status: 409 })
      }
    }

    const instructorId = (global as any).crypto?.randomUUID?.() || require('crypto').randomUUID()

    await create('instructors', {
      instructor_id: instructorId,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone ?? null,
      address: data.address ?? null,
      average_rating: 0,
      rating_count: 0,
      courses: JSON.stringify(data.courses),
      bio: data.bio ?? null,
      years_experience: data.yearsExperience ?? null,
      hourly_rate_etb: data.hourlyRateEtb ?? null,
      cv_path: data.cvPath ?? null,
      status: data.status ?? 'active',
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, error: 'Instructor already exists for this user' }, { status: 409 })
    }
    console.error('Error creating instructor:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}


