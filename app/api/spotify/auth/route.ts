// app/api/spotify/auth/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: [
      'user-read-currently-playing',
      'user-read-playback-state',
      'user-modify-playback-state', // ✅ This is what enables queueing
    ].join(' '),
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
