import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query, queryOne, create, update, remove } from '@/lib/db'

// Validation schemas
const TutorCreateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  age: z.number().min(18, "Must be at least 18 years old").max(65, "Must be under 65 years old"),
  gender: z.enum(["male", "female"]),
  gradeLevels: z.array(z.string()).min(1, "Select at least one grade level"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  availableDays: z.array(z.string()).min(1, "Select at least one day"),
  deliveryMethod: z.enum(["online", "face-to-face"]),
  cvPath: z.string().min(1, "CV is required"),
})

const TutorUpdateSchema = TutorCreateSchema.partial().extend({
  paymentStatus: z.enum(["paid", "unpaid"]).optional(),
})

// GET /api/tutors - Get all tutors
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
      params.push(JSON.stringify(subject))
    }

    if (gradeLevel) {
      whereConditions.push(`JSON_CONTAINS(t.grade_levels, ?)`)
      params.push(JSON.stringify(gradeLevel))
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
    const countQuery = `SELECT COUNT(*) as total FROM tutors t JOIN users u ON t.user_id = u.user_id ${whereClause}`
    const countResult = await queryOne<{ total: number }>(countQuery, params)
    const total = countResult?.total || 0

    // Get tutors with pagination
    const tutorsQuery = `SELECT 
        t.tutor_id,
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
        t.cv_path,
        t.payment_status,
        t.created_at,
        t.updated_at
      FROM tutors t
      JOIN users u ON t.user_id = u.user_id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`
    
    const tutors = await query(tutorsQuery, params)

    return NextResponse.json({
      success: true,
      data: tutors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tutors:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tutors' },
      { status: 500 }
    )
  }
}

// POST /api/tutors - Create a new tutor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = TutorCreateSchema.parse(body)

    // Get user_id from request body
    const userId = body.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user already has a tutor profile
    const existingTutor = await queryOne(
      'SELECT tutor_id FROM tutors WHERE user_id = ?',
      [userId]
    )

    if (existingTutor) {
      return NextResponse.json(
        { success: false, error: 'Tutor profile already exists for this user' },
        { status: 400 }
      )
    }

    // Generate UUID for tutor_id
    const tutorId = crypto.randomUUID()

    // Insert tutor data
    const tutorData = {
      tutor_id: tutorId,
      user_id: userId,
      age: validatedData.age,
      gender: validatedData.gender,
      grade_levels: JSON.stringify(validatedData.gradeLevels),
      subjects: JSON.stringify(validatedData.subjects),
      start_time: validatedData.startTime,
      end_time: validatedData.endTime,
      available_days: JSON.stringify(validatedData.availableDays),
      delivery_method: validatedData.deliveryMethod,
      cv_path: validatedData.cvPath,
    }

    await create('tutors', tutorData)

    return NextResponse.json({
      success: true,
      message: 'Tutor profile created successfully',
      data: { tutor_id: tutorId }
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

    console.error('Error creating tutor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create tutor' },
      { status: 500 }
    )
  }
}
