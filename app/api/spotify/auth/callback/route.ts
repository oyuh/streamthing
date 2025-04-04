// app/api/spotify/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { saveTokens } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    console.error("❌ Missing code from Spotify");
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const payload = new URLSearchParams({
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
      grant_type: 'authorization_code',
    });

    const encodedAuth = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      payload.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encodedAuth}`,
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    await saveTokens({ access_token, refresh_token });

    return NextResponse.redirect(new URL('/spotify', req.url));
  } catch (error: any) {
    console.error('❌ Spotify token exchange error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to authenticate with Spotify' }, { status: 500 });
  }
}
