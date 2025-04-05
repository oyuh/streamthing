
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { twitchEvents } from '@/lib/db/schema';

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Twitch challenge verification (when you subscribe)
  if (data.challenge) {
    return new NextResponse(data.challenge, { status: 200 });
  }

  // Log all Twitch events (safely)
  try {
    await db.insert(twitchEvents).values({
      type: data.subscription?.type || 'unknown',
      data: JSON.stringify(data),
    });
  } catch (err) {
    console.error("Failed to insert Twitch event:", err);
  }

  return NextResponse.json({ ok: true });
}
