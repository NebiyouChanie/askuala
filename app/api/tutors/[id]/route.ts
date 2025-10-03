import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { queryOne, update, remove } from '@/lib/db'

const TutorUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required").optional(),
  age: z.number().min(18, "Must be at least 18 years old").max(65, "Must be under 65 years old").optional(),
  gender: z.enum(["male", "female"]).optional(),
  gradeLevels: z.array(z.string()).min(1, "Select at least one grade level").optional(),
  subjects: z.array(z.string()).min(1, "Select at least one subject").optional(),
  startTime: z.string().min(1, "Start time is required").optional(),
  endTime: z.string().min(1, "End time is required").optional(),
  availableDays: z.array(z.string()).min(1, "Select at least one day").optional(),
  deliveryMethod: z.enum(["online", "face-to-face"]).optional(),
  cvPath: z.string().min(1, "CV is required").optional(),
  paymentStatus: z.enum(["paid", "unpaid"]).optional(),
})

// GET /api/tutors/[id] - Get a specific tutor
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tutor ID is required' },
        { status: 400 }
      )
    }

    const tutor = await queryOne(`
      SELECT 
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
      WHERE t.tutor_id = ?
    `, [id])

    if (!tutor) {
      return NextResponse.json(
        { success: false, error: 'Tutor not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const parsedTutor = {
      ...tutor,
      grade_levels: JSON.parse(tutor.grade_levels),
      subjects: JSON.parse(tutor.subjects),
      available_days: JSON.parse(tutor.available_days),
    }

    return NextResponse.json({
      success: true,
      data: parsedTutor
    })

  } catch (error) {
    console.error('Error fetching tutor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tutor' },
      { status: 500 }
    )
  }
}

// PUT /api/tutors/[id] - Update a specific tutor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tutor ID is required' },
        { status: 400 }
      )
    }

    // Check if tutor exists
    const existingTutor = await queryOne(
      'SELECT tutor_id FROM tutors WHERE tutor_id = ?',
      [id]
    )

    if (!existingTutor) {
      return NextResponse.json(
        { success: false, error: 'Tutor not found' },
        { status: 404 }
      )
    }

    // Validate input
    const validatedData = TutorUpdateSchema.parse(body)

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
    if (validatedData.cvPath) updateData.cv_path = validatedData.cvPath
    if (validatedData.paymentStatus) updateData.payment_status = validatedData.paymentStatus

    // Update tutor
    await update('tutors', { tutor_id: id }, updateData)

    return NextResponse.json({
      success: true,
      message: 'Tutor updated successfully'
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

    console.error('Error updating tutor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tutor' },
      { status: 500 }
    )
  }
}

// DELETE /api/tutors/[id] - Delete a specific tutor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tutor ID is required' },
        { status: 400 }
      )
    }

    // Check if tutor exists
    const existingTutor = await queryOne(
      'SELECT tutor_id FROM tutors WHERE tutor_id = ?',
      [id]
    )

    if (!existingTutor) {
      return NextResponse.json(
        { success: false, error: 'Tutor not found' },
        { status: 404 }
      )
    }

    // Delete tutor
    await remove('tutors', { tutor_id: id })

    return NextResponse.json({
      success: true,
      message: 'Tutor deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting tutor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete tutor' },
      { status: 500 }
    )
  }
}
