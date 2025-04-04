import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getTwitchAccessToken, subscribeToFollows } from '@/lib/twitch';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  try {
    const { access_token } = await getTwitchAccessToken(code);

    // Get your own Twitch user ID
    const userRes = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userId = userRes.data.data[0].id;
    await subscribeToFollows(userId, access_token); // ✅ user token

    return NextResponse.redirect(new URL('/events', req.url));
  } catch (e: any) {
    console.error('Twitch auth error:', e.response?.data || e.message);
    return NextResponse.json({ error: 'Failed to setup Twitch', details: e.response?.data }, { status: 500 });
  }
}
