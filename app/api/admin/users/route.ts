import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { userRoles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const users = await db.select().from(userRoles);
    return NextResponse.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isModerator, isBanned } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    await db
      .update(userRoles)
      .set({
        ...(isModerator !== undefined && { isModerator }),
        ...(isBanned !== undefined && { isBanned }),
      })
      .where(eq(userRoles.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating user:', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
