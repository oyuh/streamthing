import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getSpotifyAccessTokenFromDB, refreshAccessToken, getSpotifyTrackUrl } from '@/lib/spotify';
import { db } from '@/lib/db/client';
import { songRequests } from '@/lib/db/schema';

const rateLimitMap = new Map<string, number>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = rateLimitMap.get(ip) || 0;
  if (now - last < 5000) return true; // 5 seconds between requests
  rateLimitMap.set(ip, now);
  return false;
}

export async function POST(req: NextRequest) {
  const { link, requestedBy: rawRequestedBy, user } = await req.json();

  const trackId = link?.split('/track/')[1]?.split('?')[0];
  if (!trackId) {
    return NextResponse.json({ error: 'Invalid Spotify track link' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });
  }

  // 🌐 External bot support (Authorization: Bearer ...)
  const authHeader = req.headers.get('authorization');
  const botToken = process.env.BOT_API_TOKEN;

  let requestedBy = 'anonymous';
  if (authHeader === `Bearer ${botToken}`) {
    if (user?.username) {
      requestedBy = user.username;
    }
  } else {
    // Default logic for frontend/web auth
    requestedBy = rawRequestedBy || 'anonymous';
  }

  let accessToken = await getSpotifyAccessTokenFromDB();
  if (!accessToken) {
    accessToken = await refreshAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Unable to get Spotify access token' }, { status: 500 });
    }
  }

  try {
    const res = await axios.get(getSpotifyTrackUrl(trackId), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const track = res.data;

    await db.insert(songRequests).values({
      spotifyUri: track.uri,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      requestedBy,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        return NextResponse.json({ error: 'Token refresh failed' }, { status: 401 });
      }
      // Retry with new token
      return await POST(req);
    }

    console.error('Error fetching Spotify track:', err.message);
    return NextResponse.json({ error: 'Failed to fetch track info' }, { status: 500 });
  }
}
