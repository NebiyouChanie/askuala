import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { queryOne, update, remove } from '@/lib/db'

const InstructorUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  courses: z.array(z.any()).optional(),
  bio: z.string().nullable().optional(),
  yearsExperience: z.number().int().min(0).max(100).nullable().optional(),
  hourlyRateEtb: z.number().int().min(0).nullable().optional(),
  status: z.enum(['active','inactive','suspended']).optional(),
  cvPath: z.string().nullable().optional(),
})

export async function GET(_request: NextRequest, { params }: { params: Promise<{ instructor_id: string }> }) {
  try {
    const { instructor_id } = await params
    const row = await queryOne(
      `SELECT * FROM instructors WHERE instructor_id = ?`,
      [instructor_id]
    )
    if (!row) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: row })
  } catch (error) {
    console.error('Error fetching instructor:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ instructor_id: string }> }) {
  try {
    const { instructor_id } = await params
    const body = await request.json()
    const parsed = InstructorUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const data = parsed.data
    const updateData: any = {}
    if (data.firstName !== undefined) updateData.first_name = data.firstName
    if (data.lastName !== undefined) updateData.last_name = data.lastName
    if (data.email !== undefined) updateData.email = data.email
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.address !== undefined) updateData.address = data.address
    if (data.courses !== undefined) updateData.courses = JSON.stringify(data.courses)
    if (data.bio !== undefined) updateData.bio = data.bio
    if (data.yearsExperience !== undefined) updateData.years_experience = data.yearsExperience
    if (data.hourlyRateEtb !== undefined) updateData.hourly_rate_etb = data.hourlyRateEtb
    if (data.status !== undefined) updateData.status = data.status
    if (data.cvPath !== undefined) updateData.cv_path = data.cvPath

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 })
    }

    // Duplicate checks on update
    if (data.email || data.phone) {
      const dup = await queryOne(
        `SELECT instructor_id FROM instructors WHERE (email = ? OR (phone IS NOT NULL AND phone = ?)) AND instructor_id <> ? LIMIT 1`,
        [data.email ?? '', data.phone ?? '', instructor_id]
      )
      if (dup) {
        return NextResponse.json({ success: false, error: 'Another instructor with this email or phone exists' }, { status: 409 })
      }
    }

    await update('instructors', { instructor_id }, updateData)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating instructor:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ instructor_id: string }> }) {
  try {
    const { instructor_id } = await params
    await remove('instructors', { instructor_id })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting instructor:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}


