import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import {userRoles, songRequests, requestLogs, banLogs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { addToSpotifyQueue } from '@/lib/spotify';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';


export async function GET() {
  try {
    const requests = await db
      .select({
        id: songRequests.id,
        title: songRequests.title,
        artist: songRequests.artist,
        requestedBy: songRequests.requestedBy,
        createdAt: songRequests.createdAt,
        spotifyUri: songRequests.spotifyUri,
        approved: songRequests.approved,
        rejected: songRequests.rejected,
        userId: userRoles.id,
        userAvatar: userRoles.avatar,
      })
      .from(songRequests)
      .leftJoin(userRoles, eq(userRoles.username, songRequests.requestedBy))
      .where(eq(songRequests.approved, false))
      .orderBy(songRequests.createdAt);

    return NextResponse.json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
    const { id, action, banUser, banReason } = await req.json();

    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // ✅ FIXED: Use JWT authentication instead of plain cookie
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_token');

    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized (no token)' }, { status: 403 });
    }

    const user = getUserFromToken(authCookie.value);

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized (invalid token)' }, { status: 403 });
    }

    // ✅ Moderator check using database
    const [role] = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.id, user.id))
      .limit(1);

    if (!role || !role.isModerator) {
      return NextResponse.json({ error: 'Unauthorized (not moderator)' }, { status: 403 });
    }

    // ✅ Pull the request to approve/reject
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
        .set({ approved: true, rejected: action === 'reject' })
        .where(eq(songRequests.id, id));

      // Log the action
      await db.insert(requestLogs).values({
        requestId: request.id,
        action: banUser ? 'banned' : action === 'approve' ? 'approved' : 'rejected',
        moderatorId: user.id,
        moderatorUsername: user.username || 'Unknown',
        requestedBy: request.requestedBy,
        songTitle: request.title,
        songArtist: request.artist,
      });

      // Ban user if requested
      if (banUser) {
        // Get or create user role
        const [existingUser] = await db
          .select()
          .from(userRoles)
          .where(eq(userRoles.id, request.requestedBy))
          .limit(1);

        if (existingUser) {
          // Check if user is a streamer (protected)
          if (existingUser.isStreamer) {
            return NextResponse.json({ 
              error: 'Cannot ban streamer account' 
            }, { status: 403 });
          }

          await db
            .update(userRoles)
            .set({ isBanned: true })
            .where(eq(userRoles.id, request.requestedBy));
        } else {
          // Create user and ban them
          await db.insert(userRoles).values({
            id: request.requestedBy,
            username: request.requestedBy,
            isBanned: true,
          });
        }

        // Log the ban
        await db.insert(banLogs).values({
          userId: request.requestedBy,
          username: request.requestedBy,
          action: 'banned',
          reason: banReason || 'Banned from song request',
          moderatorId: user.id,
          moderatorUsername: user.username || 'Unknown',
        });
      }

      return NextResponse.json({ success: true });
    } catch (err: any) {
      console.error('Error approving/rejecting request:', err);
      return NextResponse.json(
        { error: 'Failed to update request', details: err.message },
        { status: 500 }
      );
    }
  }
