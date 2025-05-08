import { NextResponse } from 'next/server';
import { getNowPlaying } from '@/lib/spotify';
import { db } from '@/lib/db/client';
import { trackLogs } from '@/lib/db/schema';
import { desc, sql, eq, gt } from 'drizzle-orm';

export async function GET() {
  const track = await getNowPlaying();

  if (track) {
    // Get the last logged track (now at position 1)
    const [lastLog] = await db
      .select()
      .from(trackLogs)
      .where(eq(trackLogs.position, 1))
      .limit(1);

    // Only log if this track is different from the last one
    if (
      !lastLog ||
      lastLog.track !== track.track ||
      lastLog.artist !== track.artist
    ) {
      // Add the new track using the position-based system
      await addNewTrack({
        track: track.track,
        artist: track.artist,
        albumArt: track.albumArt,
        duration: track.duration.toString(),
      });
    }
  }

  const response = NextResponse.json(track || {});
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}

// Add a new track at position 1 and shift all others down
async function addNewTrack(trackData: {
  track: string;
  artist: string;
  albumArt: string;
  duration: string;
}) {
  try {
    // Atomic transaction to ensure data consistency
    await db.transaction(async (tx) => {
      // 1. Shift all existing positions down (increment position numbers)
      await tx.execute(sql`
        UPDATE "track_logs"
        SET position = position + 1
        WHERE position < 150
        ORDER BY position DESC
      `);

      // 2. Delete any track that would be pushed beyond position 150
      await tx.delete(trackLogs).where(gt(trackLogs.position, 150));

      // 3. Insert the new track at position 1
      await tx.insert(trackLogs).values({
        position: 1,
        track: trackData.track,
        artist: trackData.artist,
        albumArt: trackData.albumArt,
        duration: trackData.duration,
        // loggedAt will default to current timestamp
      });
    });

    console.log('New track added at position 1');
  } catch (error) {
    console.error('Error managing track positions:', error);
  }
}
