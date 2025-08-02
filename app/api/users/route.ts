import { db } from '@/lib/db/client';
import { userRoles } from '@/lib/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    // ✅ Require authentication
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_token');

    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized (no token)' }, { status: 403 });
    }

    const user = getUserFromToken(authCookie.value);

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized (invalid token)' }, { status: 403 });
    }

    // ✅ Require moderator permissions
    const [role] = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.id, user.id))
      .limit(1);

    if (!role || !role.isModerator) {
      return NextResponse.json({ error: 'Unauthorized (not moderator)' }, { status: 403 });
    }

    // ✅ Now fetch all users
    const users = await db.select().from(userRoles);
    return NextResponse.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
