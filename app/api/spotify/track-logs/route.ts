import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { trackLogs } from '@/lib/db/schema';
import { and, gte, lte, sql, asc, between } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number.parseInt(searchParams.get('limit') || '30', 10);
  const page = Number.parseInt(searchParams.get('page') || '1', 10);

  // Calculate positions to return based on page and limit
  const startPosition = (page - 1) * limit + 1;
  const endPosition = startPosition + limit - 1;

  const start = searchParams.get('start');
  const end = searchParams.get('end');

  type TrackResult = {
    position: number;
    track: string;
    artist: string;
    albumArt: string;
    duration: string;
    loggedAt: Date;
  };

  let tracks: TrackResult[];
  let totalCount: number;

  // Get total count (max 150)
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(trackLogs);
  totalCount = Math.min(countResult[0].count, 150);

  if (start && end) {
    // If using date range filtering
    const startDate = new Date(start);
    const endDate = new Date(end);
    const msInWeek = 7 * 24 * 60 * 60 * 1000;

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }
    if (endDate.getTime() - startDate.getTime() > msInWeek) {
      return NextResponse.json({ error: 'Date range cannot exceed 7 days' }, { status: 400 });
    }

    // Get filtered count for date range
    const filteredCountResult = await db.select({ count: sql<number>`count(*)` })
      .from(trackLogs)
      .where(
        and(
          gte(trackLogs.loggedAt, startDate),
          lte(trackLogs.loggedAt, endDate)
        )
      );
    totalCount = Math.min(filteredCountResult[0].count, 150);

    // Get tracks within date range and position range
    tracks = await db
      .select({
        position: trackLogs.position,
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
          lte(trackLogs.loggedAt, endDate),
          between(trackLogs.position, startPosition, endPosition)
        )
      )
      .orderBy(asc(trackLogs.position)) // Position 1 first (newest first)
      .limit(limit);
  } else {
    // Simple position-based pagination without date filtering
    tracks = await db
      .select({
        position: trackLogs.position,
        track: trackLogs.track,
        artist: trackLogs.artist,
        albumArt: trackLogs.albumArt,
        duration: trackLogs.duration,
        loggedAt: trackLogs.loggedAt,
      })
      .from(trackLogs)
      .where(between(trackLogs.position, startPosition, endPosition))
      .orderBy(asc(trackLogs.position)) // Position 1 first (newest first)
      .limit(limit);
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
