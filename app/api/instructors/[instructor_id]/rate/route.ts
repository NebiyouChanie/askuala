import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { queryOne, execute } from '@/lib/db'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

const RateSchema = z.object({ rating: z.number().int().min(1).max(5) })
type SessionPayload = { userId?: string }

export async function POST(request: NextRequest, { params }: { params: Promise<{ instructor_id: string }> }) {
  try {
    const { instructor_id } = await params
    const body = await request.json()
    const parsed = RateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const rating = parsed.data.rating

    // Identify current user
    const sessionToken = (await cookies()).get('session')?.value
    if (!sessionToken) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const payload = (await decrypt(sessionToken)) as SessionPayload
    if (!payload?.userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const userId = payload.userId as string

    // Ensure instructor exists
    const exists = await queryOne<{ instructor_id: string }>('SELECT instructor_id FROM instructors WHERE instructor_id = ? LIMIT 1', [instructor_id])
    if (!exists) {
      return NextResponse.json({ success: false, error: 'Instructor not found' }, { status: 404 })
    }

    // Check if user already rated this instructor
    const already = await queryOne<{ r: number }>('SELECT 1 as r FROM instructor_ratings WHERE instructor_id = ? AND user_id = ? LIMIT 1', [instructor_id, userId])
    if (already) {
      return NextResponse.json({ success: false, error: 'You have already rated this instructor' }, { status: 409 })
    }

    // Verify user has an assignment with this instructor in any applicable registration
    const assignedTraining = await queryOne<{ r: number }>('SELECT 1 as r FROM trainings WHERE user_id = ? AND instructor_id = ? LIMIT 1', [userId, instructor_id])
    const assignedResearch = await queryOne<{ r: number }>('SELECT 1 as r FROM researches WHERE user_id = ? AND instructor_id = ? LIMIT 1', [userId, instructor_id])
    const assignedEntre = await queryOne<{ r: number }>('SELECT 1 as r FROM entrepreneurships WHERE user_id = ? AND instructor_id = ? LIMIT 1', [userId, instructor_id])
    if (!assignedTraining && !assignedResearch && !assignedEntre) {
      return NextResponse.json({ success: false, error: 'You can only rate instructors who taught you' }, { status: 403 })
    }

    // Record rating
    await execute('INSERT INTO instructor_ratings (instructor_id, user_id, rating, created_at) VALUES (?, ?, ?, NOW())', [instructor_id, userId, rating])

    // Atomic aggregate update
    await execute(
      `UPDATE instructors 
       SET average_rating = (COALESCE(average_rating,0) * COALESCE(rating_count,0) + ?) / (COALESCE(rating_count,0)+1),
           rating_count = COALESCE(rating_count,0)+1
       WHERE instructor_id = ?`,
      [rating, instructor_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error rating instructor:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}


