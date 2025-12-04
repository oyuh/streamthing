import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { requestLogs, userRoles } from '@/lib/db/schema';
import { desc, sql, lt } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';

export async function GET() {
  try {
    // Authenticate user
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_token');

    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const user = getUserFromToken(authCookie.value);
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if user is a moderator
    const [role] = await db
      .select()
      .from(userRoles)
      .where(sql`${userRoles.id} = ${user.id}`)
      .limit(1);

    if (!role || !role.isModerator) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete logs older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await db
      .delete(requestLogs)
      .where(lt(requestLogs.createdAt, sevenDaysAgo));

    // Fetch all logs
    const logs = await db
      .select()
      .from(requestLogs)
      .orderBy(desc(requestLogs.createdAt));

    return NextResponse.json(logs);
  } catch (err) {
    console.error('Error fetching request logs:', err);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { requestId, action, moderatorId, moderatorUsername, requestedBy, songTitle, songArtist } = await req.json();

    if (!requestId || !action || !moderatorId || !moderatorUsername || !requestedBy || !songTitle || !songArtist) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.insert(requestLogs).values({
      requestId,
      action,
      moderatorId,
      moderatorUsername,
      requestedBy,
      songTitle,
      songArtist,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error creating request log:', err);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Authenticate user
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_token');

    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const user = getUserFromToken(authCookie.value);
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if user is a streamer
    const [role] = await db
      .select()
      .from(userRoles)
      .where(sql`${userRoles.id} = ${user.id}`)
      .limit(1);

    if (!role || !role.isStreamer) {
      return NextResponse.json({ error: 'Unauthorized - Streamer only' }, { status: 403 });
    }

    // Delete all request logs
    await db.delete(requestLogs);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error clearing request logs:', err);
    return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
  }
}
