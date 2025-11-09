import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { queryOne, update } from '@/lib/db'

const UserUpdateSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
})

export async function PUT(req: NextRequest, { params }: { params: { user_id: string } }) {
  try {
    const { user_id } = params
    if (!user_id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }

    const body = await req.json()
    const parsed = UserUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const { first_name, last_name, email, phone, address } = parsed.data

    // Ensure user exists
    const existing = await queryOne('SELECT user_id FROM users WHERE user_id = ?', [user_id])
    if (!existing) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // If updating email, ensure uniqueness
    if (email) {
      const dup = await queryOne('SELECT user_id FROM users WHERE email = ? AND user_id <> ? LIMIT 1', [email, user_id])
      if (dup) {
        return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 409 })
      }
    }

    const data: any = {}
    if (typeof first_name !== 'undefined') data.first_name = first_name
    if (typeof last_name !== 'undefined') data.last_name = last_name
    if (typeof email !== 'undefined') data.email = email
    if (typeof phone !== 'undefined') data.phone = phone
    if (typeof address !== 'undefined') data.address = address

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ success: true, message: 'No changes' })
    }

    await update('users', { user_id }, data)

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('User update error', e)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}


