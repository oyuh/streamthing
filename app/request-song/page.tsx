'use client';

import { useEffect, useState } from 'react';

export default function RequestSongPage() {
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const res = await fetch('/api/user');
      const data = await res.json();

      if (data?.id) {
        // Check ban status
        const roleRes = await fetch(`/api/users/${data.id}/role`);
        const roleData = await roleRes.json();

        if (roleData?.isBanned) {
          setIsBanned(true);
        } else {
          setUser(data);
        }
      }
    }

    checkUser();
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
          requestedBy: user?.username || 'guest',
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
    <div className="min-h-screen bg-gradient-to-br from-black to-zinc-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-lime-500 drop-shadow">
          🎵 Submit a Song Request
        </h1>

        {!user && !isBanned && (
          <div className="text-center space-y-4">
            <p className="text-zinc-300">You must be logged in with Discord to request a song.</p>
            <a
              href="/api/discord/login"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 transition px-6 py-2 rounded-lg text-white font-semibold"
            >
              Login with Discord
            </a>
          </div>
        )}

        {isBanned && (
          <div className="text-center text-red-400 font-semibold">
            🚫 You are banned from submitting song requests.
          </div>
        )}

        {user && !isBanned && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Paste your Spotify track link..."
              className="w-full px-5 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-green-400 transition outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 py-3 px-6 rounded-lg text-black font-bold transition"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Submitting...' : 'Submit'}
            </button>

            {status === 'success' && (
              <p className="text-green-400 text-center">✅ Song request submitted successfully!</p>
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
