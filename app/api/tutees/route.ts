import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query, queryOne, create, update, remove } from '@/lib/db'

// Validation schemas
const TuteeCreateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  age: z.number(),
  gender: z.enum(["male", "female"]),
  gradeLevels: z.array(z.string()).min(1, "Select at least one grade level"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  availableDays: z.array(z.string()).min(1, "Select at least one day"),
  deliveryMethod: z.enum(["online", "face-to-face", "online-&-face-to-face"]),
})

const TuteeUpdateSchema = TuteeCreateSchema.partial()

// GET /api/tutees - Get all tutees
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const subject = searchParams.get('subject') || ''
    const gradeLevel = searchParams.get('gradeLevel') || ''
    const deliveryMethod = searchParams.get('deliveryMethod') || ''

    const offset = (page - 1) * limit

    // Build WHERE clause
    let whereConditions = []
    let params = []

    if (search) {
      whereConditions.push(`(u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)`)
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (subject) {
      whereConditions.push(`JSON_CONTAINS(t.subjects, ?)`)
      params.push(`"${subject}"`)
    }

    if (gradeLevel) {
      whereConditions.push(`t.grade_level = ?`)
      params.push(gradeLevel)
    }

    if (deliveryMethod) {
      whereConditions.push(`t.delivery_method = ?`)
      params.push(deliveryMethod)
    }

    // Filter by specific user ID
    const userId = searchParams.get('userId')
    if (userId) {
      whereConditions.push(`t.user_id = ?`)
      params.push(userId)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM tutees t JOIN users u ON t.user_id = u.user_id ${whereClause}`
    const countResult = await queryOne<{ total: number }>(countQuery, params)
    const total = countResult?.total || 0

    // Get tutees with pagination
    const tuteesQuery = `SELECT 
        t.tutee_id,
        t.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.address,
        t.age,
        t.gender,
        t.grade_levels,
        t.subjects,
        t.start_time,
        t.end_time,
        t.available_days,
        t.delivery_method,
        t.payment_status,
        t.created_at,
        t.updated_at
      FROM tutees t
      JOIN users u ON t.user_id = u.user_id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`
    
    const tutees = await query(tuteesQuery, params)

    return NextResponse.json({
      success: true,
      data: tutees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tutees:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/tutees - Create a new tutee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = TuteeCreateSchema.parse(body)

    // Get user_id from request body
    const userId = body.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user already has a tutee profile
    const existingTutee = await queryOne(
      'SELECT tutee_id FROM tutees WHERE user_id = ?',
      [userId]
    )

    if (existingTutee) {
      return NextResponse.json(
        { success: false, error: 'Tutee profile already exists for this user' },
        { status: 400 }
      )
    }

    // Generate UUID for tutee_id
    const tuteeId = crypto.randomUUID()

    // Insert tutee data
    const tuteeData = {
      tutee_id: tuteeId,
      user_id: userId,
      age: validatedData.age,
      gender: validatedData.gender,
      grade_levels: JSON.stringify(validatedData.gradeLevels),
      subjects: JSON.stringify(validatedData.subjects),
      start_time: validatedData.startTime,
      end_time: validatedData.endTime,
      available_days: JSON.stringify(validatedData.availableDays),
      delivery_method: validatedData.deliveryMethod,
    }

    await create('tutees', tuteeData)

    return NextResponse.json({
      success: true,
      message: 'Tutee profile created successfully',
      data: { tutee_id: tuteeId }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    console.error('Error creating tutee:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
