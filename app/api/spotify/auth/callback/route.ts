// app/api/spotify/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { saveTokens } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  try {
    const res = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        grant_type: 'authorization_code',
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token, refresh_token } = res.data;

    // ✅ Save directly to DB
    await saveTokens({ access_token, refresh_token });

    return NextResponse.redirect(new URL('/spotify', req.url)); // overlay auto works
  } catch (err: any) {
    console.error('Spotify Auth Callback Error:', err.response?.data || err.message);
    return NextResponse.json({ error: 'Failed to authenticate with Spotify' }, { status: 500 });
  }
}
