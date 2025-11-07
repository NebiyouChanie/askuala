import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query, queryOne, create, update, remove } from '@/lib/db'

// Validation schemas
const ResearchCreateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  age: z.number(),
  gender: z.enum(["male", "female"]),
  studyArea: z.string().min(1, "Research area is required"),
  researchLevel: z.enum(["undergraduate", "graduate", "phd", "professional"]),
  deliveryMethod: z.enum(["online", "face-to-face", "online-&-face-to-face"]),
  researchGateId: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .refine(
      (v) =>
        v === undefined ||
        /^(https?:\/\/)?(www\.)?researchgate\.net\/.+$/i.test(String(v)) ||
        /^[A-Za-z0-9_.-]{3,}$/i.test(String(v)),
      { message: 'Enter a valid ResearchGate profile URL or username' }
    )
    .optional(),
  orcid: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .refine(
      (v) =>
        v === undefined ||
        /^(https?:\/\/)?(www\.)?orcid\.org\/(\d{4}-){3}\d{3}[\dX]$/i.test(String(v)) ||
        /^(\d{4}-){3}\d{3}[\dX]$/i.test(String(v)),
      { message: 'Enter a valid ORCID (e.g., 0000-0002-1825-0097) or profile URL' }
    )
    .optional(),
})

const ResearchUpdateSchema = ResearchCreateSchema.partial().extend({
  paymentStatus: z.enum(["paid", "unpaid"]).optional(),
})

// GET /api/research - Get all research registrations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const researchLevel = searchParams.get('researchLevel') || ''
    const deliveryMethod = searchParams.get('deliveryMethod') || ''

    const offset = (page - 1) * limit

    // Build WHERE clause
    let whereConditions = []
    let params = []

    if (search) {
      whereConditions.push(`(u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR r.study_area LIKE ?)`)
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (researchLevel) {
      whereConditions.push(`r.research_level = ?`)
      params.push(researchLevel)
    }

    if (deliveryMethod) {
      whereConditions.push(`r.delivery_method = ?`)
      params.push(deliveryMethod)
    }

    // Filter by specific user ID
    const userId = searchParams.get('userId')
    if (userId) {
      whereConditions.push(`r.user_id = ?`)
      params.push(userId)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM researches r JOIN users u ON r.user_id = u.user_id ${whereClause}`
    const countResult = await queryOne<{ total: number }>(countQuery, params)
    const total = countResult?.total || 0

    // Get research registrations with pagination
    const researchQuery = `SELECT 
        r.research_id,
        r.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.address,
        r.age,
        r.gender,
        r.study_area,
        r.research_level,
        r.delivery_method,
        r.researchgate_id,
        r.orcid,
        r.payment_status,
        r.created_at,
        r.updated_at
      FROM researches r
      JOIN users u ON r.user_id = u.user_id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`
    
    const research = await query(researchQuery, params)

    return NextResponse.json({
      success: true,
      data: research,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching research registrations:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/research - Create a new research registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = ResearchCreateSchema.parse(body)

    // Get user_id from request body
    const userId = body.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user already has a research registration
    const existingResearch = await queryOne(
      'SELECT research_id FROM researches WHERE user_id = ?',
      [userId]
    )

    if (existingResearch) {
      return NextResponse.json(
        { success: false, error: 'Research registration already exists for this user' },
        { status: 400 }
      )
    }

    // Generate UUID for research_id
    const researchId = crypto.randomUUID()

    // Insert research data
    const researchData = {
      research_id: researchId,
      user_id: userId,
      age: validatedData.age,
      gender: validatedData.gender,
      study_area: validatedData.studyArea,
      research_level: validatedData.researchLevel,
      delivery_method: validatedData.deliveryMethod,
      researchgate_id: validatedData.researchGateId || null,
      orcid: validatedData.orcid || null,
    }

    await create('researches', researchData)

    return NextResponse.json({
      success: true,
      message: 'Research registration created successfully',
      data: { research_id: researchId }
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

    console.error('Error creating research registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
