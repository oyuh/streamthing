import { NextResponse } from 'next/server';
import { getNowPlaying, refreshAccessToken } from '@/lib/spotify';

export async function GET() {
  let track = await getNowPlaying();

  if (track === 'expired') {
    await refreshAccessToken();
    track = await getNowPlaying();
  }

  return NextResponse.json(track || {});
}
