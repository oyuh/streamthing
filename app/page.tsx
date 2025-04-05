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

  if (!discordUser) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">
        <a
          href="/api/discord/login"
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition"
        >
          Login with Discord
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white flex flex-col items-center justify-center gap-6 px-4 py-12 font-sans">
      <h1 className="text-3xl font-bold text-center drop-shadow-md">
        Welcome, {discordUser.username}!
      </h1>

      <div className="grid gap-4 w-full max-w-md">
        <a
          href="/api/spotify/auth?login=true"
          className="block bg-green-500 hover:bg-green-600 text-black font-bold text-center py-3 rounded-lg shadow-lg transition"
        >
          Connect Spotify
        </a>

        <a
          href="/api/twitch/auth"
          className="block bg-purple-600 hover:bg-purple-700 text-white font-bold text-center py-3 rounded-lg shadow-lg transition"
        >
          Connect Twitch
        </a>

        <a
          href="/spotify"
          className="block bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-center py-3 rounded-lg shadow-lg transition"
        >
          View Spotify Overlay
        </a>

        <a
          href="/events"
          className="block bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-center py-3 rounded-lg shadow-lg transition"
        >
          View Twitch Event Overlay
        </a>

        <a
          href="/request-song"
          className="block bg-lime-500 hover:bg-lime-600 text-black font-bold text-center py-3 rounded-lg shadow-lg transition"
        >
          Request a Song
        </a>

        <a
          href="/requests"
          className="block bg-red-500 hover:bg-red-600 text-white font-bold text-center py-3 rounded-lg shadow-lg transition"
        >
          Mod Panel: Song Requests
        </a>
        <a
          href="/admin/users"
          className="block bg-blue-500 hover:bg-blue-600 text-white font-bold text-center py-3 rounded-lg shadow-lg transition"
        >
          Mod Panel: Users
        </a>
      </div>
    </div>
  );
}
