'use client';

import { useEffect, useState } from 'react';

function StatusIndicator({ label, connected }: { label: string; connected: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
        title={connected ? 'Connected' : 'Not Connected'}
      />
      <span className="text-sm font-medium">{label}: {connected ? 'Connected' : 'Not Connected'}</span>
    </div>
  );
}

export default function Home() {
  const [discordUser, setDiscordUser] = useState<any | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [spotifyStatus, setSpotifyStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const [twitchStatus, setTwitchStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data && data.username) {
          fetch(`/api/users/${data.id}/role`)
            .then(res => res.json())
            .then(role => {
              if (!role?.isModerator) {
                setUnauthorized(true);
              } else {
                setDiscordUser(data);
              }
            });
        }
      });
  }, []);

  useEffect(() => {
    if (unauthorized) {
      alert('You are not authorized to view this page.');
      window.close();
    }
  }, [unauthorized]);

  useEffect(() => {
    // Spotify: check if /api/spotify/track returns a track
    setSpotifyStatus('loading');
    fetch('/api/spotify/track')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSpotifyStatus('connected');
        } else {
          setSpotifyStatus('disconnected');
        }
      })
      .catch(() => setSpotifyStatus('disconnected'));
    // Twitch status (unchanged)
    setTwitchStatus('loading');
    fetch('/api/twitch/status')
      .then(res => res.json())
      .then(data => setTwitchStatus(data.connected ? 'connected' : 'disconnected'))
      .catch(() => setTwitchStatus('disconnected'));
  }, [discordUser]);

  if (!discordUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center text-white">
        <div className="bg-zinc-800 rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold mb-2">Welcome to Streamthing</h1>
          <p className="mb-4 text-zinc-300">Please log in to access your dashboard.</p>
          <a
            href="/api/discord/login"
            className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-lg text-white font-semibold shadow-lg transition text-lg flex items-center gap-2"
          >
            <svg width="24" height="24" fill="currentColor" className="inline-block"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276c-.598.3428-1.2205.6447-1.8733.8923a.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1835 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1835 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
            Login with Discord
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white flex flex-col items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-2xl bg-zinc-800/80 rounded-2xl shadow-2xl p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold drop-shadow-md mb-1">Welcome, {discordUser.username}!</h1>
            <p className="text-zinc-300 text-lg">Your Streamthing Dashboard</p>
          </div>
          <div className="flex flex-col gap-2 min-w-[180px]">
            <StatusIndicator label="Spotify" connected={spotifyStatus === 'connected'} />
            <StatusIndicator label="Twitch" connected={twitchStatus === 'connected'} />
          </div>
        </div>
        <div className="grid gap-4 w-full grid-cols-1 md:grid-cols-2">
          <a
            href="/api/spotify/auth?login=true"
            className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-black font-bold text-center py-4 px-4 rounded-lg shadow-lg transition text-lg justify-center"
          >
            <svg width="24" height="24" fill="currentColor" className="inline-block"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm4.29 14.71a1 1 0 01-1.41 0c-2.34-2.34-6.14-2.34-8.48 0a1 1 0 01-1.41-1.41c2.93-2.93 7.67-2.93 10.6 0a1 1 0 010 1.41zm2.12-2.83a1 1 0 01-1.41 0c-3.9-3.9-10.24-3.9-14.14 0a1 1 0 01-1.41-1.41c4.68-4.68 12.28-4.68 16.97 0a1 1 0 010 1.41z"/></svg>
            Connect Spotify
          </a>
          <a
            href="/api/twitch/auth"
            className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-center py-4 px-4 rounded-lg shadow-lg transition text-lg justify-center"
          >
            <svg width="24" height="24" fill="currentColor" className="inline-block"><path d="M4.285 2L2 6.285V21.143h5.143V24h3.428l3.428-2.857h4.285L22 17.143V2H4.285zm15.143 14.286l-2.286 2.286h-4.285l-3.428 2.857v-2.857H4.285V3.714h15.143v12.572zM8.571 7.143h1.714v5.143H8.571V7.143zm5.143 0h1.714v5.143h-1.714V7.143z"/></svg>
            Connect Twitch
          </a>
          <a
            href="/spotify"
            className="flex items-center gap-3 bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-center py-4 px-4 rounded-lg shadow-lg transition text-lg justify-center"
          >
            <svg width="24" height="24" fill="currentColor" className="inline-block"><circle cx="12" cy="12" r="10" fill="#1DB954"/><path d="M17.6 16.2c-.2.3-.6.4-.9.2-2.5-1.5-5.7-1.8-9.4-.8-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 4-1.1 7.5-.8 10.3.9.3.2.4.6.3.9zm1.3-2.8c-.2.3-.5.4-.8.2-2.9-1.8-7.3-2.3-10.7-1-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9 3.8-1.4 8.6-.8 11.8 1.1.3.2.4.6.1.9zm.2-2.9C15.2 8.2 8.8 8 5.7 9.1c-.5.2-1-.1-1.1-.5-.2-.5.1-1 .5-1.1 3.5-1.2 10.4-1 13.7 1.2.5.2.6.8.3 1.2-.2.3-.7.4-1 .2z"/></svg>
            View Spotify Overlay
          </a>
          <a
            href="/events"
            className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-center py-4 px-4 rounded-lg shadow-lg transition text-lg justify-center"
          >
            <svg width="24" height="24" fill="currentColor" className="inline-block"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z"/></svg>
            View Twitch Event Overlay
          </a>
          <a
            href="/request-song"
            className="flex items-center gap-3 bg-lime-500 hover:bg-lime-600 text-black font-bold text-center py-4 px-4 rounded-lg shadow-lg transition text-lg justify-center"
          >
            <svg width="24" height="24" fill="currentColor" className="inline-block"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/></svg>
            Request a Song
          </a>
          <a
            href="/requests"
            className="flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold text-center py-4 px-4 rounded-lg shadow-lg transition text-lg justify-center"
          >
            <svg width="24" height="24" fill="currentColor" className="inline-block"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-3c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>
            Mod Panel: Song Requests
          </a>
          <a
            href="/admin/users"
            className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-center py-4 px-4 rounded-lg shadow-lg transition text-lg justify-center"
          >
            <svg width="24" height="24" fill="currentColor" className="inline-block"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C15.64 13.36 17 14.28 17 15.5V19h7v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            Mod Panel: Users
          </a>
        </div>
      </div>
    </div>
  );
}
