import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const session = req.cookies.get('session')?.value
    if (!session) {
      const url = req.nextUrl.clone()
      url.pathname = '/auth/signin'
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }

    // Verify role in token
    try {
      const secretKey = (process.env.SESSION_SECRET || 'dev_secret') as string
      const encodeKey = new TextEncoder().encode(secretKey)
      const { payload } = await jwtVerify(session, encodeKey, { algorithms: ['HS256'] })
      const role = (payload as any)?.role
      if (role !== 'admin') {
        const url = req.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    } catch (_) {
      
      const url = req.nextUrl.clone()
      url.pathname = '/auth/signin'
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Block admin users from accessing /my-courses page
  if (pathname === '/my-courses') {
    const session = req.cookies.get('session')?.value
    if (session) {
      try {
        const secretKey = (process.env.SESSION_SECRET || 'dev_secret') as string
        const encodeKey = new TextEncoder().encode(secretKey)
        const { payload } = await jwtVerify(session, encodeKey, { algorithms: ['HS256'] })
        const role = (payload as any)?.role
        if (role === 'admin') {
          const url = req.nextUrl.clone()
          url.pathname = '/admin'
          return NextResponse.redirect(url)
        }
      } catch (_) {
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/my-courses'],
}
 