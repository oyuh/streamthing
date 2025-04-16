import { NextResponse } from 'next/server';
import { getNowPlaying } from '@/lib/spotify';
import { db } from '@/lib/db/client';
import { trackLogs } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

// This is the function that Vercel's cron job will trigger
export async function GET(request: Request) {
  // Verify authorization if you set up a CRON_SECRET
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const track = await getNowPlaying();

    if (track) {
      // Get the last logged track
      const [lastLog] = await db
        .select()
        .from(trackLogs)
        .orderBy(desc(trackLogs.loggedAt))
        .limit(1);

      // Only log if this track is different from the last one
      if (
        !lastLog ||
        lastLog.track !== track.track ||
        lastLog.artist !== track.artist
      ) {
        await db.insert(trackLogs).values({
          track: track.track,
          artist: track.artist,
          albumArt: track.albumArt,
          duration: track.duration.toString(),
        });
        return NextResponse.json({ ok: true, message: "New track logged" });
      }

      return NextResponse.json({ ok: true, message: "Same track, not logged" });
    }

    return NextResponse.json({ ok: true, message: "No track playing" });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ ok: false, error: "Failed to process track" }, { status: 500 });
  }
}
