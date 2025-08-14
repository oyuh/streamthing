import { NextRequest, NextResponse } from 'next/server';

// Simple image proxy to avoid CORS tainting when sampling colors from canvas
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const src = searchParams.get('src');
    if (!src) {
      return new NextResponse('Missing src parameter', { status: 400 });
    }

    const upstream = await fetch(src);
    if (!upstream.ok) {
      return new NextResponse('Failed to fetch image', { status: upstream.status });
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': contentType,
        // Allow canvas usage from same-origin
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    console.error('Album art proxy error:', e);
    return new NextResponse('Proxy error', { status: 500 });
  }
}
