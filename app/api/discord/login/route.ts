import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI!);
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;

  return NextResponse.redirect(discordAuthUrl);
}
