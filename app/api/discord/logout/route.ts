import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the current request URL to redirect to the same domain
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Create response that redirects to home page of current domain
    const response = NextResponse.redirect(new URL('/', baseUrl));

    // Clear the secure auth token
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0), // Set to expire immediately
    });

    // Also clear legacy cookies for compatibility
    response.cookies.delete('auth_token');
    response.cookies.delete('discord_user');
    response.cookies.delete('discord-user');
    response.cookies.delete('discord-token');
    response.cookies.delete('session');

    // Additional cleanup for any potential session cookies
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');

    return response;
  } catch (error) {
    console.error('Error during logout:', error);

    // Fallback: still redirect to home even if there's an error
    // Use request URL to get current domain for fallback too
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const fallbackResponse = NextResponse.redirect(new URL('/', baseUrl));

    // Try to clear cookies anyway
    fallbackResponse.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });
    fallbackResponse.cookies.delete('auth_token');
    fallbackResponse.cookies.delete('discord_user');
    fallbackResponse.cookies.delete('discord-user');
    fallbackResponse.cookies.delete('discord-token');
    fallbackResponse.cookies.delete('session');

    return fallbackResponse;
  }
}
