import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { twitchEvents } from '@/lib/db/schema';

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Twitch challenge verification (when you subscribe)
  if (data.challenge) {
    return new NextResponse(data.challenge, { status: 200 });
  }

  // Store follow event
  if (data.subscription.type === 'channel.follow') {
    const event = data.event;
    await db.insert(twitchEvents).values({
      id: event.id,
      username: event.user_name,
      type: 'follow',
    });
  }

  return NextResponse.json({ ok: true });
}
