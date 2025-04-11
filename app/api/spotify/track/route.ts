import { NextResponse } from 'next/server';
import { getNowPlaying } from '@/lib/spotify';

export async function GET() {
  const track = await getNowPlaying();
  const response = NextResponse.json(track || {});
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
