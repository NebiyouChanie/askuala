import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

export async function GET() {
  try {
    const session = (await cookies()).get('session')?.value
    if (!session) {
      return NextResponse.json({ user: null })
    }
    const payload = await decrypt(session)
    if (!payload) {
      return NextResponse.json({ user: null })
    }
    const { userId, firstName, lastName, email, role } = payload as any
    const userData = { userId, firstName, lastName, email, role }
    return NextResponse.json({ user: userData })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}


