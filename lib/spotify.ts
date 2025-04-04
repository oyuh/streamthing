import axios from 'axios';
import { db } from '@/lib/db/client';
import { spotifyTokens } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getStoredTokens() {
  const tokens = await db.select().from(spotifyTokens).where(eq(spotifyTokens.id, 'singleton')).limit(1);
  return tokens[0] || null;
}

export async function saveTokens({ access_token, refresh_token }: { access_token: string, refresh_token?: string }) {
  const existing = await getStoredTokens();

  if (existing) {
    await db.update(spotifyTokens)
      .set({
        access_token,
        ...(refresh_token ? { refresh_token } : {}),
        updated_at: new Date(),
      })
      .where(eq(spotifyTokens.id, 'singleton'));
  } else {
    await db.insert(spotifyTokens).values({
      id: 'singleton',
      access_token,
      refresh_token: refresh_token || '',
      updated_at: new Date(),
    });
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const stored = await getStoredTokens();
  if (!stored?.refresh_token) return null;

  try {
    const res = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: stored.refresh_token,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token } = res.data;
    await saveTokens({ access_token });
    return access_token;
  } catch (err: any) {
    console.error('Failed to refresh token:', err.response?.data || err.message);
    return null;
  }
}

export async function getNowPlaying() {
  const stored = await getStoredTokens();
  if (!stored?.access_token) return null;

  try {
    const res = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${stored.access_token}` },
    });

    if (!res.data || !res.data.item) return null;

    const item = res.data.item;

    return {
      track: item.name,
      artist: item.artists.map((a: any) => a.name).join(', '),
      albumArt: item.album.images[0].url,
      progress: res.data.progress_ms,
      duration: item.duration_ms,
    };
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return null;
      return await getNowPlaying(); // retry
    }

    console.error('Spotify API Error:', err.response?.data || err.message);
    return null;
  }
}
