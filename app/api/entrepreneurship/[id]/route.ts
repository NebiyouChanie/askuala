import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { queryOne, update, remove } from '@/lib/db'

const EntrepreneurshipUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required").optional(),
  age: z.number().optional(),
  gender: z.enum(["male", "female"]).optional(),
  deliveryMethod: z.enum(["online", "face-to-face", "online-&-face-to-face"]).optional(),
  paymentStatus: z.enum(["paid", "unpaid"]).optional(),
})

// GET /api/entrepreneurship/[id] - Get a specific entrepreneurship registration
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Entrepreneurship ID is required' },
        { status: 400 }
      )
    }

    const entrepreneurship = await queryOne(`
      SELECT 
        e.entrepreneurship_id,
        e.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.address,
        e.age,
        e.gender,
        e.instructor_id,
        e.delivery_method,
        e.payment_status,
        e.created_at,
        e.updated_at
      FROM entrepreneurships e
      JOIN users u ON e.user_id = u.user_id
      WHERE e.entrepreneurship_id = ?
    `, [id])

    if (!entrepreneurship) {
      return NextResponse.json(
        { success: false, error: 'Entrepreneurship registration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: entrepreneurship
    })

  } catch (error) {
    console.error('Error fetching entrepreneurship registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/entrepreneurship/[id] - Update a specific entrepreneurship registration
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Entrepreneurship ID is required' },
        { status: 400 }
      )
    }

    // Check if entrepreneurship registration exists
    const existingEntrepreneurship = await queryOne(
      'SELECT entrepreneurship_id FROM entrepreneurships WHERE entrepreneurship_id = ?',
      [id]
    )

    if (!existingEntrepreneurship) {
      return NextResponse.json(
        { success: false, error: 'Entrepreneurship registration not found' },
        { status: 404 }
      )
    }

    // Validate input
    const validatedData = EntrepreneurshipUpdateSchema.parse(body)

    // Prepare update data
    const updateData: any = {}
    
    if (validatedData.age) updateData.age = validatedData.age
    if (validatedData.gender) updateData.gender = validatedData.gender
    if (validatedData.deliveryMethod) updateData.delivery_method = validatedData.deliveryMethod
    if (typeof (body as any).instructorId !== 'undefined') updateData.instructor_id = (body as any).instructorId || null

    // Update entrepreneurship registration
    if (validatedData.paymentStatus) updateData.payment_status = validatedData.paymentStatus

    await update('entrepreneurships', { entrepreneurship_id: id }, updateData)

    return NextResponse.json({
      success: true,
      message: 'Entrepreneurship registration updated successfully'
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

    console.error('Error updating entrepreneurship registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/entrepreneurship/[id] - Delete a specific entrepreneurship registration
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Entrepreneurship ID is required' },
        { status: 400 }
      )
    }

    // Check if entrepreneurship registration exists
    const existingEntrepreneurship = await queryOne(
      'SELECT entrepreneurship_id FROM entrepreneurships WHERE entrepreneurship_id = ?',
      [id]
    )

    if (!existingEntrepreneurship) {
      return NextResponse.json(
        { success: false, error: 'Entrepreneurship registration not found' },
        { status: 404 }
      )
    }

    // Delete entrepreneurship registration
    await remove('entrepreneurships', { entrepreneurship_id: id })

    return NextResponse.json({
      success: true,
      message: 'Entrepreneurship registration deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting entrepreneurship registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
