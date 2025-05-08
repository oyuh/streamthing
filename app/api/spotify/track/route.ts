import { NextResponse } from 'next/server';
import { getNowPlaying } from '@/lib/spotify';
import { db } from '@/lib/db/client';
import { trackLogs } from '@/lib/db/schema';
import { desc, sql, eq } from 'drizzle-orm';

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
      // Add the new track to the database
      await db.insert(trackLogs).values({
        track: track.track,
        artist: track.artist,
        albumArt: track.albumArt,
        duration: track.duration.toString(),
        // loggedAt will default to now
      });

      // Maintain maximum of 150 tracks in the database
      await maintainTrackLimit();
    }
  }

  const response = NextResponse.json(track || {});
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}

// Helper function to maintain a maximum of 150 tracks in the database
async function maintainTrackLimit() {
  try {
    // Get the total count of tracks
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(trackLogs);
    const totalTracks = countResult[0].count;

    // If we have more than 150 tracks, delete the oldest ones
    if (totalTracks > 150) {
      const tracksToDelete = totalTracks - 150;

      // Get IDs of oldest tracks
      const oldestTracks = await db
        .select({ id: trackLogs.id })
        .from(trackLogs)
        .orderBy(trackLogs.loggedAt)
        .limit(tracksToDelete);

      // Delete the oldest tracks
      if (oldestTracks.length > 0) {
        for (const track of oldestTracks) {
          await db.delete(trackLogs).where(eq(trackLogs.id, track.id));
        }
      }
    }
  } catch (error) {
    console.error('Error maintaining track limit:', error);
  }
}
