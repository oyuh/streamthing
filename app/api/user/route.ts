// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';

export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth_token');

  if (!authCookie) {
    return NextResponse.json({});
  }

  const user = getUserFromToken(authCookie.value);

  if (!user) {
    // Token is invalid or expired, clear the cookie
    const response = NextResponse.json({});
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });
    return response;
  }

  return NextResponse.json({
    id: user.id,
    username: user.username,
  });
}
