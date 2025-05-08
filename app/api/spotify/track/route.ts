import { NextResponse } from 'next/server';
import { getNowPlaying } from '@/lib/spotify';
import { db } from '@/lib/db/client';
import { trackLogs } from '@/lib/db/schema';
import { desc, sql, eq, gt, asc } from 'drizzle-orm';

export async function GET() {
  try {
    console.log("GET /api/spotify/track - Fetching current track...");
    const track = await getNowPlaying();
    console.log("Track data from Spotify:", track ? `${track.track} by ${track.artist}` : "No track playing");

    if (track) {
      // Get the last logged track (now at position 1)
      const lastLogResult = await db
        .select()
        .from(trackLogs)
        .orderBy(asc(trackLogs.position))
        .limit(1);

      const lastLog = lastLogResult.length > 0 ? lastLogResult[0] : null;
      console.log("Last logged track:", lastLog ? `${lastLog.track} by ${lastLog.artist} (position: ${lastLog.position})` : "No previous tracks");

      // Debug: Count total tracks in the log
      const countResult = await db.select({ count: sql<number>`count(*)` }).from(trackLogs);
      console.log(`Current track count: ${countResult[0].count}`);

      // Only log if this track is different from the last one
      if (
        !lastLog ||
        lastLog.track !== track.track ||
        lastLog.artist !== track.artist
      ) {
        console.log("New track detected! Adding to database...");
        await addNewTrack({
          track: track.track,
          artist: track.artist,
          albumArt: track.albumArt,
          duration: track.duration.toString(),
        });
      } else {
        console.log("Track hasn't changed. Not adding to database.");
      }
    }

    const response = NextResponse.json(track || {});
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    console.error("Error in track endpoint:", error);
    return NextResponse.json({ error: "Failed to fetch track data" }, { status: 500 });
  }
}

// Add a new track at position 1 and shift all others down
async function addNewTrack(trackData: {
  track: string;
  artist: string;
  albumArt: string;
  duration: string;
}) {
  try {
    console.log("Adding new track:", trackData.track, "by", trackData.artist);

    // First try: Try a simple direct insert at position 1 if the table is empty
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(trackLogs);
    if (countResult[0].count === 0) {
      console.log("No existing tracks. Inserting directly at position 1.");
      await db.insert(trackLogs).values({
        position: 1,
        track: trackData.track,
        artist: trackData.artist,
        albumArt: trackData.albumArt,
        duration: trackData.duration,
      });
      console.log("Successfully added first track at position 1");
      return;
    }

    // Otherwise, use transaction approach for existing tracks
    console.log("Existing tracks found. Using transaction for position shifting.");
    await db.transaction(async (tx) => {
      // 1. Shift all existing positions down (increment position numbers)
      const updateResult = await tx.execute(sql`
        UPDATE "track_logs"
        SET position = position + 1
        WHERE position < 150
        ORDER BY position DESC
      `);
      console.log(`Shifted positions for existing tracks`);

      // 2. Delete any track that would be pushed beyond position 150
      const deleteResult = await tx.delete(trackLogs).where(gt(trackLogs.position, 150));
      console.log(`Removed tracks beyond position 150`);

      // 3. Insert the new track at position 1
      await tx.insert(trackLogs).values({
        position: 1,
        track: trackData.track,
        artist: trackData.artist,
        albumArt: trackData.albumArt,
        duration: trackData.duration,
      });
      console.log("Successfully inserted new track at position 1");
    });

    // Verify the insertion worked
    const afterCount = await db.select({ count: sql<number>`count(*)` }).from(trackLogs);
    console.log(`Track count after adding: ${afterCount[0].count}`);

    // Get and log the first track to verify it's the one we just added
    const firstTrack = await db
      .select()
      .from(trackLogs)
      .where(eq(trackLogs.position, 1))
      .limit(1);

    if (firstTrack.length > 0) {
      console.log(`Verified position 1 now contains: ${firstTrack[0].track} by ${firstTrack[0].artist}`);
    } else {
      console.error("Failed to find track at position 1 after insertion!");
    }
  } catch (error) {
    console.error('Error managing track positions:', error);
    // Try a direct insert as fallback
    try {
      console.log("Transaction failed. Attempting direct insert as fallback...");
      await db.insert(trackLogs).values({
        position: 1,
        track: trackData.track,
        artist: trackData.artist,
        albumArt: trackData.albumArt,
        duration: trackData.duration,
      });
      console.log("Fallback direct insert succeeded");
    } catch (fallbackError) {
      console.error("Fallback insert also failed:", fallbackError);
    }
  }
}
