import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email parameter is required'
      }, { status: 400 })
    }

    // Search for users by email (partial match)
    const users = await query(
      `SELECT user_id, first_name, last_name, email, phone, address 
       FROM users 
       WHERE email LIKE ? 
       ORDER BY first_name, last_name`,
      [`%${email}%`]
    )

    return NextResponse.json({
      success: true,
      users: users || []
    })

  } catch (error) {
    console.error('Error searching users:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
