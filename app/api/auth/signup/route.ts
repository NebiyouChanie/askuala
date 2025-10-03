import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { create, findOne } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

const SignupSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = SignupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const { first_name, last_name, email, phone, address, password } = parsed.data
    const user_id = randomUUID()
    const passwordHash = await bcrypt.hash(password, 10)

    // Check existing user
    const existing = await findOne('users', { email })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    // Create user (parameterized inside create())
    await create('users', { user_id, first_name, last_name, email, phone, address, password: passwordHash })
    return NextResponse.json({ success: true, user_id })
  } catch (e) {
    console.error('Signup error', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


