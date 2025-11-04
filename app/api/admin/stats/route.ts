import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export async function GET() {
  try {
    const [tutors, tutees, trainings, researches, entrepreneurship, instructors] = await Promise.all([
      queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM tutors'),
      queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM tutees'),
      queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM trainings'),
      queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM researches'),
      queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM entrepreneurships'),
      queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM instructors'),
    ])

    return NextResponse.json({
      success: true,
      data: {
        tutors: tutors?.total ?? 0,
        tutees: tutees?.total ?? 0,
        trainings: trainings?.total ?? 0,
        researches: researches?.total ?? 0,
        entrepreneurships: entrepreneurship?.total ?? 0,
        instructors: instructors?.total ?? 0,
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}


