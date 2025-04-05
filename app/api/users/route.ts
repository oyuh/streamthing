import { db } from '@/lib/db/client';
import { userRoles } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await db.select().from(userRoles);
    return NextResponse.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
