import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query, queryOne, create, update, remove } from '@/lib/db'

// Validation schemas
const TrainingCreateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  age: z.number(),
  gender: z.enum(["male", "female"]),
  trainingType: z.string().min(1, "Training type is required"),
  deliveryMethod: z.enum(["online", "face-to-face", "online-&-face-to-face"]),
  instructorId: z.string().optional(),
})

const TrainingUpdateSchema = TrainingCreateSchema.partial().extend({
  paymentStatus: z.enum(["paid", "unpaid"]).optional(),
})

// GET /api/training - Get all training registrations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const trainingType = searchParams.get('trainingType') || ''
    const deliveryMethod = searchParams.get('deliveryMethod') || ''

    const offset = (page - 1) * limit

    // Build WHERE clause
    let whereConditions = []
    let params = []

    if (search) {
      whereConditions.push(`(u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)`)
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (trainingType) {
      whereConditions.push(`t.training_type = ?`)
      params.push(trainingType)
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
    const countQuery = `SELECT COUNT(*) as total FROM trainings t JOIN users u ON t.user_id = u.user_id ${whereClause}`
    const countResult = await queryOne<{ total: number }>(countQuery, params)
    const total = countResult?.total || 0

    // Get training registrations with pagination
    const trainingQuery = `SELECT 
        t.training_id,
        t.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.address,
        t.age,
        t.gender,
        t.training_type,
        t.delivery_method,
        t.instructor_id,
        t.payment_status,
        t.created_at,
        t.updated_at
      FROM trainings t
      JOIN users u ON t.user_id = u.user_id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`
    
    const training = await query(trainingQuery, params)

    return NextResponse.json({
      success: true,
      data: training,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching training registrations:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/training - Create a new training registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = TrainingCreateSchema.parse(body)

    // Get user_id from request body
    const userId = body.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user already has a training registration
    const existingTraining = await queryOne(
      'SELECT training_id FROM trainings WHERE user_id = ?',
      [userId]
    )

    if (existingTraining) {
      return NextResponse.json(
        { success: false, error: 'Training registration already exists for this user' },
        { status: 400 }
      )
    }

    // Generate UUID for training_id
    const trainingId = crypto.randomUUID()

    // Insert training data
    const trainingData = {
      training_id: trainingId,
      user_id: userId,
      age: validatedData.age,
      gender: validatedData.gender,
      training_type: validatedData.trainingType,
      delivery_method: validatedData.deliveryMethod,
      instructor_id: validatedData.instructorId || null,
    }

    await create('trainings', trainingData)

    return NextResponse.json({
      success: true,
      message: 'Training registration created successfully',
      data: { training_id: trainingId }
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

    console.error('Error creating training registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
