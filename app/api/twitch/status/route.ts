import { NextResponse } from 'next/server';

export async function GET() {
  // Simple status check - always return disconnected for now
  // This prevents errors in the home page
  return NextResponse.json({ connected: false });
}
