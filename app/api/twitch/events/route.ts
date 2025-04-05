import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { twitchEvents } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const events = await db
      .select()
      .from(twitchEvents)
      .orderBy(desc(twitchEvents.createdAt));

    return NextResponse.json(events);
  } catch (err: any) {
    console.error("⨯ Error loading events:", err);
    return NextResponse.json({ error: 'Failed to fetch events', details: err.message }, { status: 500 });
  }
}
