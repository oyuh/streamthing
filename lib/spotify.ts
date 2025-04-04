import axios from 'axios';
import { cookies } from 'next/headers';

export async function getNowPlaying() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value || '';

  if (!accessToken) {
    console.log('❌ No access token found in cookies.');
    return null;
  }

  try {
    const result = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!result.data || !result.data.item) return null;

    const item = result.data.item;

    return {
      track: item.name,
      artist: item.artists.map((a: any) => a.name).join(", "),
      albumArt: item.album.images[0].url,
      progress: result.data.progress_ms,
      duration: item.duration_ms
    };
  } catch (error: any) {
    if (error.response?.status === 401) return 'expired';
    console.error("⚠️ Spotify API error:", error.response?.data || error.message);
    return null;
  }
}

export async function refreshAccessToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('spotify_refresh_token')?.value || '';

  if (!refreshToken) {
    console.log('❌ No refresh token found.');
    return null;
  }

  try {
    const result = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

    const newToken = result.data.access_token;
    cookieStore.set('spotify_access_token', newToken, {
      path: '/',
      httpOnly: true,
    });

    console.log('🔄 Spotify access token refreshed.');
    return newToken;
  } catch (err: any) {
    console.error('❌ Failed to refresh token:', err.response?.data || err.message);
    return null;
  }
}
