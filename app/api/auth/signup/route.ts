import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { create, findOne, update } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { sendEmail } from '@/lib/sendEmail'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

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
    const adminCreate = !!body?.adminCreate
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

    if (adminCreate) {
      // Require admin session
      const tokenCookie = (await cookies()).get('session')?.value
      if (!tokenCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const payload: any = await decrypt(tokenCookie)
      if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      await create('users', {
        user_id,
        first_name,
        last_name,
        email,
        phone,
        address,
        password: passwordHash,
        is_verified: 1,
        verification_token: null,
        verification_expires: null,
      })
    } else {
      // Create user with unverified status and verification token
      const token = randomUUID()
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24h
      await create('users', {
        user_id,
        first_name,
        last_name,
        email,
        phone,
        address,
        password: passwordHash,
        is_verified: 0,
        verification_token: token,
        verification_expires: expiresAt,
      })

      const origin = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`
      const verifyUrl = `${origin}/api/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
      const subject = 'Verify your Askuala account'
      const text = `Welcome to Askuala!\n\nPlease verify your email by visiting:\n${verifyUrl}\n\nThis link expires in 24 hours.`
      const html = `<p>Welcome to Askuala!</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}" target="_blank">Verify my email</a></p><p>This link expires in 24 hours.</p>`
      try {
        await sendEmail(email, subject, text, html)
      } catch {
        // If email fails, keep user created but allow re-send.
      }
    }

    return NextResponse.json({ success: true, user_id })
  } catch (e) {
    console.error('Signup error', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


