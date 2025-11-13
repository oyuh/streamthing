import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { banLogs, userRoles } from '@/lib/db/schema';
import { desc, sql, eq } from 'drizzle-orm';
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

    // Fetch all ban logs (no deletion, permanent record)
    const logs = await db
      .select()
      .from(banLogs)
      .orderBy(desc(banLogs.createdAt));

    return NextResponse.json(logs);
  } catch (err) {
    console.error('Error fetching ban logs:', err);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, username, action, reason, moderatorId, moderatorUsername } = await req.json();

    if (!userId || !username || !action || !moderatorId || !moderatorUsername) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['banned', 'unbanned'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await db.insert(banLogs).values({
      userId,
      username,
      action,
      reason: reason || null,
      moderatorId,
      moderatorUsername,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error creating ban log:', err);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing log ID' }, { status: 400 });
    }

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

    // Delete specific ban log
    await db.delete(banLogs).where(sql`${banLogs.id} = ${id}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting ban log:', err);
    return NextResponse.json({ error: 'Failed to delete log' }, { status: 500 });
  }
}
