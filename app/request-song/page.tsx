'use client';

import { useEffect, useState } from 'react';

export default function RequestSongPage() {
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [discordUser, setDiscordUser] = useState<{ id: string; username: string } | null>(null);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data?.username) setDiscordUser(data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/spotify/submit-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          link,
          requestedBy: discordUser?.username || 'guest',
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(result.error || 'Something went wrong');
        return;
      }

      setStatus('success');
      setLink('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg('Server error.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-700/50 backdrop-blur-sm shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-500">
          🎵 Submit a Song Request
        </h1>

        {!discordUser ? (
          <div className="text-center space-y-4">
            <p className="text-zinc-400">You must be logged in with Discord to request a song.</p>
            <a
              href="/api/discord/login"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-semibold text-white transition"
            >
              Login with Discord
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Paste your Spotify track link..."
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              required
            />

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg transition"
            >
              {status === 'loading' ? 'Submitting...' : 'Submit'}
            </button>

            {status === 'success' && (
              <p className="text-green-400 text-center">✅ Song request submitted!</p>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-center">❌ {errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
