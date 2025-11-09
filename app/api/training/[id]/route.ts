import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { queryOne, update, remove } from '@/lib/db'

const TrainingUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required").optional(),
  age: z.number().optional(),
  gender: z.enum(["male", "female"]).optional(),
  trainingType: z.string().min(1, "Training type is required").optional(),
  deliveryMethod: z.enum(["online", "face-to-face", "online-&-face-to-face"]).optional(),
  paymentStatus: z.enum(["paid", "unpaid"]).optional(),
})

// GET /api/training/[id] - Get a specific training registration
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Training ID is required' },
        { status: 400 }
      )
    }

    const training = await queryOne(`
      SELECT 
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
      WHERE t.training_id = ?
    `, [id])

    if (!training) {
      return NextResponse.json(
        { success: false, error: 'Training registration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: training
    })

  } catch (error) {
    console.error('Error fetching training registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/training/[id] - Update a specific training registration
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Training ID is required' },
        { status: 400 }
      )
    }

    // Check if training registration exists
    const existingTraining = await queryOne(
      'SELECT training_id FROM trainings WHERE training_id = ?',
      [id]
    )

    if (!existingTraining) {
      return NextResponse.json(
        { success: false, error: 'Training registration not found' },
        { status: 404 }
      )
    }

    // Validate input
    const validatedData = TrainingUpdateSchema.parse(body)

    // Prepare update data
    const updateData: any = {}
    
    if (validatedData.age) updateData.age = validatedData.age
    if (validatedData.gender) updateData.gender = validatedData.gender
    if (validatedData.trainingType) updateData.training_type = validatedData.trainingType
    if (validatedData.deliveryMethod) updateData.delivery_method = validatedData.deliveryMethod
    if (typeof (body as any).instructorId !== 'undefined') updateData.instructor_id = (body as any).instructorId || null

    // Update training registration
    if (validatedData.paymentStatus) updateData.payment_status = validatedData.paymentStatus

    await update('trainings', { training_id: id }, updateData)

    return NextResponse.json({
      success: true,
      message: 'Training registration updated successfully'
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

    console.error('Error updating training registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/training/[id] - Delete a specific training registration
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Training ID is required' },
        { status: 400 }
      )
    }

    // Check if training registration exists
    const existingTraining = await queryOne(
      'SELECT training_id FROM trainings WHERE training_id = ?',
      [id]
    )

    if (!existingTraining) {
      return NextResponse.json(
        { success: false, error: 'Training registration not found' },
        { status: 404 }
      )
    }

    // Delete training registration
    await remove('trainings', { training_id: id })

    return NextResponse.json({
      success: true,
      message: 'Training registration deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting training registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
