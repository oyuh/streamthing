// app/api/users/[id]/role/route.ts
import { db } from '@/lib/db/client';
import { userRoles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

type Params = {
  params: { id: string };
};

export async function GET(_req: Request, context: Params) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    const [user] = await db.select().from(userRoles).where(eq(userRoles.id, id)).limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      isModerator: user.isModerator,
      isBanned: user.isBanned,
    });
  } catch (err) {
    console.error('Error fetching user role:', err);
    return NextResponse.json({ error: 'Failed to fetch user role' }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: Params) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { isModerator, isBanned } = body;

    await db
      .update(userRoles)
      .set({
        isModerator: typeof isModerator === 'boolean' ? isModerator : undefined,
        isBanned: typeof isBanned === 'boolean' ? isBanned : undefined,
      })
      .where(eq(userRoles.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating user role:', err);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}
