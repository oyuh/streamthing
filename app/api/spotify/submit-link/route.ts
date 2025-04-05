import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getSpotifyAccessTokenFromDB, refreshAccessToken } from '@/lib/spotify';
import { db } from '@/lib/db/client';
import { songRequests } from '@/lib/db/schema';


export async function POST(req: NextRequest) {
  const { link, requestedBy } = await req.json();

  const trackId = link?.split('/track/')[1]?.split('?')[0];
  if (!trackId) {
    return NextResponse.json({ error: 'Invalid Spotify track link' }, { status: 400 });
  }

  let accessToken = await getSpotifyAccessTokenFromDB();
  if (!accessToken) {
    accessToken = await refreshAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Unable to get Spotify access token' }, { status: 500 });
    }
  }

  try {
    const res = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const track = res.data;

    await db.insert(songRequests).values({
      spotifyUri: track.uri,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      requestedBy: requestedBy || 'anonymous',
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
