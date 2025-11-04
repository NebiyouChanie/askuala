import { NextRequest, NextResponse } from 'next/server'
import { queryOne, update } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const origin = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`
  const successRedirect = `${origin}/auth/signin?verified=1`
  const errorRedirect = (msg: string) => `${origin}/auth/signin?verifyError=${encodeURIComponent(msg)}`
  try {
    const token = searchParams.get('token') || ''
    const email = searchParams.get('email') || ''
    if (!token || !email) {
      return NextResponse.redirect(errorRedirect('Invalid verification link'))
    }

    const row = await queryOne<any>(
      'SELECT user_id, verification_expires FROM users WHERE email = ? AND verification_token = ? AND is_verified = 0 LIMIT 1',
      [email, token]
    )
    if (!row) {
      return NextResponse.redirect(errorRedirect('Invalid or already used token'))
    }
    const exp = new Date(row.verification_expires)
    if (isNaN(exp.getTime()) || exp.getTime() < Date.now()) {
      return NextResponse.redirect(errorRedirect('Verification link has expired'))
    }

    await update('users', { user_id: row.user_id }, { is_verified: 1, verification_token: null, verification_expires: null })
    return NextResponse.redirect(successRedirect)
  } catch (e) {
    console.error('Verify error', e)
    return NextResponse.redirect(errorRedirect('Internal server error'))
  }
}


