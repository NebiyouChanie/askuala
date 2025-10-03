import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query, queryOne, create, update, remove } from '@/lib/db'

// Validation schemas
const EntrepreneurshipCreateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  age: z.number().min(18, "Must be at least 18 years old").max(65, "Must be under 65 years old"),
  gender: z.enum(["male", "female"]),
})

const EntrepreneurshipUpdateSchema = EntrepreneurshipCreateSchema.partial().extend({
  paymentStatus: z.enum(["paid", "unpaid"]).optional(),
})

// GET /api/entrepreneurship - Get all entrepreneurship registrations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const gender = searchParams.get('gender') || ''

    const offset = (page - 1) * limit

    // Build WHERE clause
    let whereConditions = []
    let params = []

    if (search) {
      whereConditions.push(`(u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)`)
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (gender) {
      whereConditions.push(`e.gender = ?`)
      params.push(gender)
    }

    // Filter by specific user ID
    const userId = searchParams.get('userId')
    if (userId) {
      whereConditions.push(`e.user_id = ?`)
      params.push(userId)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM entrepreneurships e JOIN users u ON e.user_id = u.user_id ${whereClause}`
    const countResult = await queryOne<{ total: number }>(countQuery, params)
    const total = countResult?.total || 0

    // Get entrepreneurship registrations with pagination
    const entrepreneurshipQuery = `SELECT 
        e.entrepreneurship_id,
        e.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.address,
        e.age,
        e.gender,
        e.payment_status,
        e.created_at,
        e.updated_at
      FROM entrepreneurships e
      JOIN users u ON e.user_id = u.user_id
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`
    
    const entrepreneurship = await query(entrepreneurshipQuery, params)

    return NextResponse.json({
      success: true,
      data: entrepreneurship,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching entrepreneurship registrations:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/entrepreneurship - Create a new entrepreneurship registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = EntrepreneurshipCreateSchema.parse(body)

    // Get user_id from request body
    const userId = body.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user already has an entrepreneurship registration
    const existingEntrepreneurship = await queryOne(
      'SELECT entrepreneurship_id FROM entrepreneurships WHERE user_id = ?',
      [userId]
    )

    if (existingEntrepreneurship) {
      return NextResponse.json(
        { success: false, error: 'Entrepreneurship registration already exists for this user' },
        { status: 400 }
      )
    }

    // Generate UUID for entrepreneurship_id
    const entrepreneurshipId = crypto.randomUUID()

    // Insert entrepreneurship data
    const entrepreneurshipData = {
      entrepreneurship_id: entrepreneurshipId,
      user_id: userId,
      age: validatedData.age,
      gender: validatedData.gender,
    }

    await create('entrepreneurships', entrepreneurshipData)

    return NextResponse.json({
      success: true,
      message: 'Entrepreneurship registration created successfully',
      data: { entrepreneurship_id: entrepreneurshipId }
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

    console.error('Error creating entrepreneurship registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
