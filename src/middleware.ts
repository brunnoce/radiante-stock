import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function decodeJWT(token: string) {
  try {
    const json = Buffer.from(token.split('.')[1], 'base64url').toString()
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('payload-token')?.value
  const jwt = token ? decodeJWT(token) : null
  const isValid = jwt && jwt.exp * 1000 > Date.now()

  const protectedRoutes = ['/', '/stock', '/historial']
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  if (isProtected && !isValid) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/login' && isValid) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/stock/:path*', '/historial/:path*', '/login'],
}
