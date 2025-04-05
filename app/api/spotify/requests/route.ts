import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { songRequests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { addToSpotifyQueue } from '@/lib/spotify';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const requests = await db
      .select()
      .from(songRequests)
      .where(eq(songRequests.approved, false))
      .orderBy(songRequests.createdAt);

    return NextResponse.json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, action } = body;

  if (!id || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }

  // ✅ Fix: Await cookies() for Vercel compatibility
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('discord_user');

  if (!userCookie) {
    return NextResponse.json({ error: 'Unauthorized (no cookie)' }, { status: 403 });
  }

  let user;
  try {
    user = JSON.parse(userCookie.value);
  } catch {
    return NextResponse.json({ error: 'Invalid cookie data' }, { status: 400 });
  }

  const allowedIds = process.env.NEXT_PUBLIC_ALLOWED_DISCORD_USERS?.split(',') || [];
  if (!allowedIds.includes(user.id)) {
    return NextResponse.json({ error: 'Unauthorized (not allowed)' }, { status: 403 });
  }

  const [request] = await db
    .select()
    .from(songRequests)
    .where(eq(songRequests.id, id))
    .limit(1);

  if (!request) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  try {
    if (action === 'approve') {
      await addToSpotifyQueue(request.spotifyUri);
    }

    await db
      .update(songRequests)
      .set({ approved: true, rejected: action === 'reject' }) // Optionally set rejected = true
      .where(eq(songRequests.id, id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error approving/rejecting request:', err);
    return NextResponse.json({
      error: 'Failed to update request',
      details: err.message,
    }, { status: 500 });
  }
}
