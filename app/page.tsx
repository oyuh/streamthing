'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [discordUser, setDiscordUser] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        const allowedIds = (process.env.NEXT_PUBLIC_ALLOWED_DISCORD_USERS || '').split(',');

        if (allowedIds.includes(String(data.id))) {
          setDiscordUser(data);
        }
      });
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: '#0d0d0d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      {!discordUser ? (
        <a
          href="/api/discord/login"
          style={{
            padding: '10px 20px',
            backgroundColor: '#5865F2',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 500,
            border: 'none',
          }}
        >
          Login with Discord
        </a>
      ) : (
        <>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Welcome, {discordUser.username}!</h1>

          <a
            href="/api/spotify/auth?login=true"
            style={{
              padding: '8px 16px',
              backgroundColor: '#1DB954',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              border: 'none',
            }}
          >
            Connect Spotify
          </a>

          <a
            href="/spotify"
            style={{
              padding: '8px 16px',
              backgroundColor: '#444',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              border: 'none',
            }}
          >
            View Spotify Overlay
          </a>
        </>
      )}
    </div>
  );
}
