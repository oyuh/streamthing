// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('discord_user');
  const user = cookie ? JSON.parse(cookie.value) : null;

  return NextResponse.json(user || {});
}
