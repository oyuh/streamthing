import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { trackLogs } from '@/lib/db/schema';
import { desc, and, gte, lte } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '30', 10);

  const start = searchParams.get('start');
  const end = searchParams.get('end');

  let tracks;

  if (start && end) {
    // Validate dates and max range (7 days)
    const startDate = new Date(start);
    const endDate = new Date(end);
    const msInWeek = 7 * 24 * 60 * 60 * 1000;

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }
    if (endDate.getTime() - startDate.getTime() > msInWeek) {
      return NextResponse.json({ error: 'Date range cannot exceed 7 days' }, { status: 400 });
    }

    tracks = await db
      .select({
        track: trackLogs.track,
        artist: trackLogs.artist,
        albumArt: trackLogs.albumArt,
        duration: trackLogs.duration,
        loggedAt: trackLogs.loggedAt,
      })
      .from(trackLogs)
      .where(
        and(
          gte(trackLogs.loggedAt, startDate),
          lte(trackLogs.loggedAt, endDate)
        )
      )
      .orderBy(desc(trackLogs.loggedAt));
  } else {
    // Default: last 30 tracks
    tracks = await db
      .select({
        track: trackLogs.track,
        artist: trackLogs.artist,
        albumArt: trackLogs.albumArt,
        duration: trackLogs.duration,
        loggedAt: trackLogs.loggedAt,
      })
      .from(trackLogs)
      .orderBy(desc(trackLogs.loggedAt))
      .limit(limit);
  }

  const response = NextResponse.json(tracks);
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
