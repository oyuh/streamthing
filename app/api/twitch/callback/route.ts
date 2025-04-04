import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getTwitchAccessToken, getTwitchUser, subscribeToStreamOnline } from '@/lib/twitch';


export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  try {
    const { access_token } = await getTwitchAccessToken(code);

    // ✅ Fetch user info using the token
    const user = await getTwitchUser(access_token);

    console.log("🎯 Twitch user:", user);
    console.log("🔑 Token (start):", access_token.slice(0, 10));

    // ✅ Use new stream.online fallback
    await subscribeToStreamOnline(user.id, access_token);

    return NextResponse.redirect(new URL('/events', req.url));
  } catch (error: any) {
    console.error('Twitch auth error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to setup Twitch', details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
