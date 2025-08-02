import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create response that redirects to home page
    const response = NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL || 'http://localhost:3000'));

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
    const fallbackResponse = NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL || 'http://localhost:3000'));

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
