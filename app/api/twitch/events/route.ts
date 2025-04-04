import { db } from '@/lib/db/client';
import { twitchEvents } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  const events = await db
    .select()
    .from(twitchEvents)
    .orderBy(desc(twitchEvents.created_at))
    .limit(5);

  return NextResponse.json(events);
}
