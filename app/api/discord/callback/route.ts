// app/api/discord/callback/route.ts
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
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = response.data;

    const userInfo = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userInfo.data;

    const cookieStore = await cookies(); // 👈 FIX HERE
    cookieStore.set('discord_user', JSON.stringify({
      id: user.id,
      username: user.username,
    }), {
      httpOnly: true,
      path: '/',
    });

    return NextResponse.redirect(new URL('/', req.url));
  } catch (error: any) {
    console.error('Discord auth error:', error);
    return NextResponse.json({ error: 'Failed to authenticate with Discord' }, { status: 500 });
  }
}
