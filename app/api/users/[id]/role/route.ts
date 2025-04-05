import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { userRoles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    // Query the userRoles table for the given ID
    const [user] = await db.select().from(userRoles).where(eq(userRoles.id, id)).limit(1);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Return the found user role record
    return NextResponse.json(user);
  } catch (err) {
    console.error('Error fetching user role:', err);
    return NextResponse.json({ error: 'Failed to fetch user role' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  let data: any;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { isModerator, isBanned } = data;

  // Validate that at least one of isModerator or isBanned is provided as boolean
  if (typeof isModerator !== 'boolean' && typeof isBanned !== 'boolean') {
    return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
  }

  // Prepare the fields to update
  const updates: { isModerator?: boolean; isBanned?: boolean } = {};
  if (typeof isModerator === 'boolean') updates.isModerator = isModerator;
  if (typeof isBanned === 'boolean') updates.isBanned = isBanned;

  try {
    // Perform the update in the database, returning the updated record
    const updatedUsers = await db
      .update(userRoles)
      .set(updates)
      .where(eq(userRoles.id, id))
      .returning({
        id: userRoles.id,
        username: userRoles.username,
        isModerator: userRoles.isModerator,
        isBanned: userRoles.isBanned,
        createdAt: userRoles.createdAt
      });
    if (updatedUsers.length === 0) {
      // No user found with that ID
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Return the updated user role data
    return NextResponse.json(updatedUsers[0]);
  } catch (err) {
    console.error('Error updating user role:', err);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
