import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        grant_type: 'authorization_code',
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    const cookieStore = await cookies();
    cookieStore.set('spotify_access_token', access_token, {
      path: '/',
      httpOnly: true,
    });

    cookieStore.set('spotify_refresh_token', refresh_token, {
      path: '/',
      httpOnly: true,
    });

    return NextResponse.redirect(new URL('/spotify', req.url));
  } catch (err: any) {
    console.error('❌ Spotify token exchange failed:', err.response?.data || err.message);
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 });
  }
}
