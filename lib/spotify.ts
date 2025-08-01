// Helper to get Spotify track URL
export function getSpotifyTrackUrl(trackId: string) {
  return `https://api.spotify.com/v1/tracks/${trackId}`;
}
import axios from 'axios';
import { db } from '@/lib/db/client';
import { spotifyTokens } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Get only the access token from the singleton row
 */
export async function getSpotifyAccessTokenFromDB(): Promise<string | null> {
  const [row] = await db
    .select()
    .from(spotifyTokens)
    .where(eq(spotifyTokens.id, 'singleton'))
    .limit(1);

  return row?.access_token || null;
}

/**
 * Get the full token row from DB
 */
export async function getStoredTokens() {
  const [row] = await db
    .select()
    .from(spotifyTokens)
    .where(eq(spotifyTokens.id, 'singleton'))
    .limit(1);

  return row || null;
}

/**
 * Save access + optional refresh token to DB
 */
export async function saveTokens({
  access_token,
  refresh_token,
}: {
  access_token: string;
  refresh_token?: string;
}) {
  const existing = await getStoredTokens();

  if (existing) {
    await db
      .update(spotifyTokens)
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

/**
 * Refresh the access token using refresh_token from DB
 */
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
      console.error('❌ Failed to refresh token:', err.response?.data || err.message);
      return null;
    }
  }

/**
 * Get the currently playing track
 */
export async function getNowPlaying(): Promise<{
  track: string;
  artist: string;
  albumArt: string;
  progress: number;
  duration: number;
} | null> {
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
      return await getNowPlaying(); // retry after refresh
    }

    console.error('Spotify API Error:', err.response?.data || err.message);
    return null;
  }
}

/**
 * Add a song to the Spotify queue
 */
export async function addToSpotifyQueue(uri: string) {
    const accessToken = await getSpotifyAccessTokenFromDB();
    if (!accessToken) throw new Error("No Spotify access token available");

    // Step 1: Check for active device
    const devicesRes = await axios.get('https://api.spotify.com/v1/me/player/devices', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const devices = devicesRes.data.devices;
    const activeDevice = devices.find((d: any) => d.is_active);

    if (!activeDevice) {
      console.warn("⚠️ No active Spotify device found. Playback must be active to queue tracks.");
      return false; // ✅ Don't throw, just return false
    }

    // Step 2: Try to queue
    try {
      const res = await axios.post(
        'https://api.spotify.com/v1/me/player/queue',
        null,
        {
          params: { uri },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.status === 204) {
        console.log("✅ Track added to queue.");
        return true;
      }

      // ⚠️ If it's 200 or something else, it probably failed silently
      console.warn("⚠️ Spotify responded with non-204:", res.status, res.data);
      return false;
    } catch (err: any) {
      console.error("❌ Queue error:", err.response?.data || err.message);
      throw err;
    }
  }
