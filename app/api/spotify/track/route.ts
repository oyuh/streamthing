import { NextResponse } from 'next/server';
import { getNowPlaying } from '@/lib/spotify';

export async function GET() {
  try {
    const track = await getNowPlaying();
    const response = NextResponse.json(track || {});
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch track data" }, { status: 500 });
  }
}
