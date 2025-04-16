import { NextResponse } from 'next/server';
import { getNowPlaying } from '@/lib/spotify';
import { db } from '@/lib/db/client';
import { trackLogs } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
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
        // loggedAt will default to now
      });
    }
  }

  const response = NextResponse.json(track || {});
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
