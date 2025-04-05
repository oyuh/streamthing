import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { userRoles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

type Params = { id: string };

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  const [user] = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.id, id))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  const { isModerator, isBanned } = await req.json();

  if (typeof isModerator !== 'boolean' && typeof isBanned !== 'boolean') {
    return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
  }

  await db
    .update(userRoles)
    .set({
      ...(typeof isModerator === 'boolean' && { isModerator }),
      ...(typeof isBanned === 'boolean' && { isBanned }),
    })
    .where(eq(userRoles.id, id));

  return NextResponse.json({ success: true });
}
