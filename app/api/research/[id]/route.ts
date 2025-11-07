import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { queryOne, update, remove } from '@/lib/db'

const ResearchUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required").optional(),
  age: z.number().optional(),
  gender: z.enum(["male", "female"]).optional(),
  studyArea: z.string().min(1, "Research area is required").optional(),
  researchLevel: z.enum(["undergraduate", "graduate", "phd", "professional"]).optional(),
  deliveryMethod: z.enum(["online", "face-to-face", "online-&-face-to-face"]).optional(),
  paymentStatus: z.enum(["paid", "unpaid"]).optional(),
})

// GET /api/research/[id] - Get a specific research registration
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Research ID is required' },
        { status: 400 }
      )
    }

    const research = await queryOne(`
      SELECT 
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
        r.instructor_id,
        r.researchgate_id,
        r.orcid,
        r.payment_status,
        r.created_at,
        r.updated_at
      FROM researches r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.research_id = ?
    `, [id])

    if (!research) {
      return NextResponse.json(
        { success: false, error: 'Research registration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: research
    })

  } catch (error) {
    console.error('Error fetching research registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/research/[id] - Update a specific research registration
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Research ID is required' },
        { status: 400 }
      )
    }

    // Check if research registration exists
    const existingResearch = await queryOne(
      'SELECT research_id FROM researches WHERE research_id = ?',
      [id]
    )

    if (!existingResearch) {
      return NextResponse.json(
        { success: false, error: 'Research registration not found' },
        { status: 404 }
      )
    }

    // Validate input
    const validatedData = ResearchUpdateSchema.parse(body)

    // Prepare update data
    const updateData: any = {}
    
    if (validatedData.age) updateData.age = validatedData.age
    if (validatedData.gender) updateData.gender = validatedData.gender
    if (validatedData.studyArea) updateData.study_area = validatedData.studyArea
    if (validatedData.researchLevel) updateData.research_level = validatedData.researchLevel
    if (validatedData.deliveryMethod) updateData.delivery_method = validatedData.deliveryMethod
    if (typeof (body as any).instructorId !== 'undefined') updateData.instructor_id = (body as any).instructorId || null
    if (typeof (body as any).researchGateId !== 'undefined') updateData.researchgate_id = (body as any).researchGateId || null
    if (typeof (body as any).orcid !== 'undefined') updateData.orcid = (body as any).orcid || null

    // Update research registration
    if (validatedData.paymentStatus) updateData.payment_status = validatedData.paymentStatus

    await update('researches', { research_id: id }, updateData)

    return NextResponse.json({
      success: true,
      message: 'Research registration updated successfully'
    })

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

    console.error('Error updating research registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/research/[id] - Delete a specific research registration
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Research ID is required' },
        { status: 400 }
      )
    }

    // Check if research registration exists
    const existingResearch = await queryOne(
      'SELECT research_id FROM researches WHERE research_id = ?',
      [id]
    )

    if (!existingResearch) {
      return NextResponse.json(
        { success: false, error: 'Research registration not found' },
        { status: 404 }
      )
    }

    // Delete research registration
    await remove('researches', { research_id: id })

    return NextResponse.json({
      success: true,
      message: 'Research registration deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting research registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
