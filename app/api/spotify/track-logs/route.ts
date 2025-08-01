
import { NextResponse } from 'next/server';
import { getSpotifyAccessTokenFromDB, refreshAccessToken } from '@/lib/spotify';
import axios from 'axios';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let limit = Number.parseInt(searchParams.get('limit') || '30', 10);
  if (isNaN(limit) || limit < 1) limit = 1;
  if (limit > 50) limit = 50;

  async function fetchRecentlyPlayed(accessToken: string) {
    return axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit },
    });
  }

  let accessToken = await getSpotifyAccessTokenFromDB();
  if (!accessToken) {
    return NextResponse.json({ error: 'No Spotify access token available' }, { status: 401 });
  }

  let res;
  try {
    res = await fetchRecentlyPlayed(accessToken);
  } catch (err: any) {
    if (err.response?.status === 401) {
      // Try to refresh token and retry
      accessToken = await refreshAccessToken();
      if (!accessToken) {
        return NextResponse.json({ error: 'Unable to refresh Spotify token' }, { status: 401 });
      }
      try {
        res = await fetchRecentlyPlayed(accessToken);
      } catch (err2: any) {
        return NextResponse.json({ error: 'Spotify API error', details: err2.response?.data || err2.message }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'Spotify API error', details: err.response?.data || err.message }, { status: 500 });
    }
  }

  const items = res.data.items || [];
  const tracks = items.map((item: any, idx: number) => {
    const t = item.track;
    return {
      position: idx + 1,
      track: t.name,
      artist: t.artists.map((a: any) => a.name).join(', '),
      albumArt: t.album.images[0]?.url || '',
      duration: t.duration_ms,
      playedAt: item.played_at,
    };
  });

  const response = NextResponse.json({
    tracks,
    pagination: {
      total: tracks.length,
      limit,
    }
  });
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
