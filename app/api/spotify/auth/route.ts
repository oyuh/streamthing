import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const scope = 'user-read-currently-playing';
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;
  const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;

  return NextResponse.redirect(authURL);
}
