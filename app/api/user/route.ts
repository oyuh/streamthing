// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { userRoles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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

  try {
    // Fetch complete user role information from database
    const [userRole] = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.id, user.id))
      .limit(1);

    if (!userRole) {
      // User exists in JWT but not in database, return basic info
      return NextResponse.json({
        id: user.id,
        username: user.username,
      });
    }

    return NextResponse.json({
      id: userRole.id,
      username: userRole.username,
      isModerator: userRole.isModerator,
      isStreamer: userRole.isStreamer,
      isBanned: userRole.isBanned,
    });
  } catch (error) {
    console.error('Error fetching user role:', error);
    // Fallback to basic info if database query fails
    return NextResponse.json({
      id: user.id,
      username: user.username,
    });
  }
}
