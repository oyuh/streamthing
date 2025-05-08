import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { trackLogs } from '@/lib/db/schema';
import { desc, and, gte, lte, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number.parseInt(searchParams.get('limit') || '30', 10);
  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const offset = (page - 1) * limit;

  const start = searchParams.get('start');
  const end = searchParams.get('end');

  type TrackResult = {
    track: string;
    artist: string;
    albumArt: string;
    duration: string;
    loggedAt: Date;
  };

  let tracks: TrackResult[];
  let totalCount: number;

  // Get total count for pagination
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(trackLogs);
  totalCount = countResult[0].count;

  if (start && end) {
    // Validate dates and max range (7 days)
    const startDate = new Date(start);
    const endDate = new Date(end);
    const msInWeek = 7 * 24 * 60 * 60 * 1000;

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }
    if (endDate.getTime() - startDate.getTime() > msInWeek) {
      return NextResponse.json({ error: 'Date range cannot exceed 7 days' }, { status: 400 });
    }

    // Get filtered count
    const filteredCountResult = await db.select({ count: sql<number>`count(*)` })
      .from(trackLogs)
      .where(
        and(
          gte(trackLogs.loggedAt, startDate),
          lte(trackLogs.loggedAt, endDate)
        )
      );
    totalCount = filteredCountResult[0].count;

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
      .orderBy(desc(trackLogs.loggedAt))
      .limit(limit)
      .offset(offset);
  } else {
    // Default: paginated tracks
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
      .limit(limit)
      .offset(offset);
  }

  const totalPages = Math.ceil(totalCount / limit);

  const response = NextResponse.json({
    tracks,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages
    }
  });
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
