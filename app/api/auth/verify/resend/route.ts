import { NextRequest, NextResponse } from 'next/server'
import { queryOne, update } from '@/lib/db'
import { randomUUID } from 'crypto'
import { sendEmail } from '@/lib/sendEmail'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 })

    const user = await queryOne<any>('SELECT user_id, is_verified FROM users WHERE email = ? LIMIT 1', [email])
    if (!user) return NextResponse.json({ success: true }) // Do not leak existence
    if (user.is_verified) return NextResponse.json({ success: true })

    const token = randomUUID()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24)
    await update('users', { user_id: user.user_id }, { verification_token: token, verification_expires: expiresAt })

    const origin = process.env.NEXT_PUBLIC_APP_URL || ''
    const verifyUrl = `${origin}/api/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
    const subject = 'Verify your Askuala Plus account'
    const text = `Please verify your email by visiting: ${verifyUrl}`
    const html = `<p>Please verify your email by clicking <a href="${verifyUrl}" target="_blank">this link</a>.</p>`
    try { await sendEmail(email, subject, text, html) } catch {}

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Resend verify error', e)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}











