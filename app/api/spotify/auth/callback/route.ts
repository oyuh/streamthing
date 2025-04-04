import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { saveTokens } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    console.error("❌ Missing authorization code");
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const authString = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const base64Auth = Buffer.from(authString).toString('base64');

    const res = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
      }).toString(),
      {
        headers: {
          'Authorization': `Basic ${base64Auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token } = res.data;

    // ✅ Save to database for Streamlabs usage
    await saveTokens({ access_token, refresh_token });

    return NextResponse.redirect(new URL('/spotify', req.url));
  } catch (err: any) {
    console.error("❌ Spotify token exchange failed:", err.response?.data || err.message);
    return NextResponse.json({ error: 'Failed to authenticate with Spotify' }, { status: 500 });
  }
}
