'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [discordUser, setDiscordUser] = useState<any | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data && data.username) {
          const allowedIds = process.env.NEXT_PUBLIC_ALLOWED_DISCORD_USERS?.split(',') || [];
          if (!allowedIds.includes(data.id)) {
            setUnauthorized(true);
          } else {
            setDiscordUser(data);
          }
        }
      });
  }, []);

  useEffect(() => {
    if (unauthorized) {
      alert('You are not authorized to view this page.');
      window.close();
    }
  }, [unauthorized]);

  if (!discordUser) {
    return (
      <div style={{ backgroundColor: '#121212', color: 'white', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <a
          href="/api/discord/login"
          style={{
            padding: '12px 24px',
            backgroundColor: '#5865F2',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          Login with Discord
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif'
      }}
    >
      <h1 style={{ fontSize: '2rem' }}>Welcome, {discordUser.username}!</h1>

      <a
        href="/api/spotify/auth?login=true"
        style={{
          padding: '10px 20px',
          backgroundColor: '#1DB954',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
        }}
      >
        Connect Spotify
      </a>

      <a
        href="/api/twitch/auth"
        style={{
          padding: '10px 20px',
          backgroundColor: '#9146FF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
        }}
      >
        Connect Twitch
      </a>

      <a
        href="/spotify"
        style={{
          padding: '10px 20px',
          backgroundColor: '#535353',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
        }}
      >
        View Spotify Overlay
      </a>

      <a
        href="/events"
        style={{
          padding: '10px 20px',
          backgroundColor: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
        }}
      >
        View Twitch Event Overlay
      </a>
    </div>
  );
}
