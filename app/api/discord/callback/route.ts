// app/api/discord/callback/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/lib/db/client';
import { userRoles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createSecureToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    // Exchange the code for a token
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

    // Get Discord user info
    const userInfo = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userInfo.data;

    // Create secure JWT token instead of plain JSON
    const secureToken = createSecureToken({
      id: user.id,
      username: user.username,
    });

    // Set the secure token as an httpOnly cookie
    const res = NextResponse.redirect(new URL('/', req.url));
    res.cookies.set('auth_token', secureToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    // ✅ Insert or update user in DB with streamer role check
    const isStreamerUser = user.id === process.env.STREAMER_DISCORD_ID;

    const existing = await db.select().from(userRoles).where(eq(userRoles.id, user.id)).limit(1);
    if (existing.length > 0) {
      // Update existing user, preserve existing roles unless they're the streamer
      const updateData: any = {
        username: user.username,
        avatar: user.avatar || null,
      };
      if (isStreamerUser) {
        updateData.isStreamer = true;
        updateData.isModerator = true; // Streamers are also moderators
      }

      await db
        .update(userRoles)
        .set(updateData)
        .where(eq(userRoles.id, user.id));
    } else {
      // Create new user with appropriate roles
      await db.insert(userRoles).values({
        id: user.id,
        username: user.username,
        avatar: user.avatar || null,
        isStreamer: isStreamerUser,
        isModerator: isStreamerUser, // Streamers are also moderators
      });
    }

    return res;
  } catch (error: any) {
    console.error('Discord auth error:', error?.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to authenticate with Discord' }, { status: 500 });
  }
}
