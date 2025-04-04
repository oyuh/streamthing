import { NextResponse } from 'next/server';
import { getNowPlaying } from '@/lib/spotify';

export async function GET() {
  const track = await getNowPlaying();
  return NextResponse.json(track || {});
}
