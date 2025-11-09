import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { queryOne, update, remove } from '@/lib/db'

const TuteeUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required").optional(),
  age: z.number().optional(),
  gender: z.enum(["male", "female"]).optional(),
  gradeLevels: z.array(z.string()).min(1, "Select at least one grade level").optional(),
  subjects: z.array(z.string()).min(1, "Select at least one subject").optional(),
  startTime: z.string().min(1, "Start time is required").optional(),
  endTime: z.string().min(1, "End time is required").optional(),
  availableDays: z.array(z.string()).min(1, "Select at least one day").optional(),
  deliveryMethod: z.enum(["online", "face-to-face", "online-&-face-to-face"]).optional(),
  paymentStatus: z.enum(["paid", "unpaid"]).optional(),
  status: z.enum(["pending","accepted","rejected"]).optional(),
})

// GET /api/tutees/[id] - Get a specific tutee
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tutee ID is required' },
        { status: 400 }
      )
    }

    const tutee = await queryOne(`
      SELECT 
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
        t.status,
        t.created_at,
        t.updated_at
      FROM tutees t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.tutee_id = ?
    `, [id])

    if (!tutee) {
      return NextResponse.json(
        { success: false, error: 'Tutee not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const parsedTutee = {
      ...tutee,
      grade_levels: typeof (tutee as any).grade_levels === 'string' ? JSON.parse((tutee as any).grade_levels) : (tutee as any).grade_levels,
      subjects: typeof (tutee as any).subjects === 'string' ? JSON.parse((tutee as any).subjects) : (tutee as any).subjects,
      available_days: typeof (tutee as any).available_days === 'string' ? JSON.parse((tutee as any).available_days) : (tutee as any).available_days,
    }

    return NextResponse.json({
      success: true,
      data: parsedTutee
    })

  } catch (error) {
    console.error('Error fetching tutee:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/tutees/[id] - Update a specific tutee
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tutee ID is required' },
        { status: 400 }
      )
    }

    // Check if tutee exists
    const existingTutee = await queryOne(
      'SELECT tutee_id FROM tutees WHERE tutee_id = ?',
      [id]
    )

    if (!existingTutee) {
      return NextResponse.json(
        { success: false, error: 'Tutee not found' },
        { status: 404 }
      )
    }

    // Validate input
    const validatedData = TuteeUpdateSchema.parse(body)

    // Prepare update data
    const updateData: any = {}
    
    if (validatedData.age) updateData.age = validatedData.age
    if (validatedData.gender) updateData.gender = validatedData.gender
    if (validatedData.gradeLevels) updateData.grade_levels = JSON.stringify(validatedData.gradeLevels)
    if (validatedData.subjects) updateData.subjects = JSON.stringify(validatedData.subjects)
    if (validatedData.startTime) updateData.start_time = validatedData.startTime
    if (validatedData.endTime) updateData.end_time = validatedData.endTime
    if (validatedData.availableDays) updateData.available_days = JSON.stringify(validatedData.availableDays)
    if (validatedData.deliveryMethod) updateData.delivery_method = validatedData.deliveryMethod
    if (validatedData.paymentStatus) updateData.payment_status = validatedData.paymentStatus
    if (validatedData.status) updateData.status = validatedData.status

    // Update tutee
    await update('tutees', { tutee_id: id }, updateData)

    return NextResponse.json({
      success: true,
      message: 'Tutee updated successfully'
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

    console.error('Error updating tutee:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/tutees/[id] - Delete a specific tutee
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tutee ID is required' },
        { status: 400 }
      )
    }

    // Check if tutee exists
    const existingTutee = await queryOne(
      'SELECT tutee_id FROM tutees WHERE tutee_id = ?',
      [id]
    )

    if (!existingTutee) {
      return NextResponse.json(
        { success: false, error: 'Tutee not found' },
        { status: 404 }
      )
    }

    // Delete tutee
    await remove('tutees', { tutee_id: id })

    return NextResponse.json({
      success: true,
      message: 'Tutee deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting tutee:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
