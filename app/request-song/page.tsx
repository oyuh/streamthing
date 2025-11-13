'use client';

import { useEffect, useState } from 'react';
import { FaSpotify, FaDiscord } from 'react-icons/fa';

export default function RequestSongPage() {
  const [link, setLink] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isBanned, setIsBanned] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        if (data?.username) {
          setUser(data);
          setIsBanned(data.isBanned || false);
        }
        setIsCheckingAuth(false);
      })
      .catch(() => {
        setIsCheckingAuth(false);
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!link.trim() || loading || !user) return;

    setLoading(true);
    setStatus('');

    try {
      const res = await fetch('/api/spotify/submit-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          link: link.trim(),
          requestedBy: user.username,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('✓ Request submitted successfully!');
        setLink('');
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus(data.error || 'Failed to submit request');
      }
    } catch {
      setStatus('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 px-4">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/60 p-8 text-center backdrop-blur-xl">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-4">
            <FaDiscord className="text-3xl text-white" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Login Required</h1>
          <p className="mb-6 text-sm text-gray-400">
            You need to login with Discord to submit song requests
          </p>
          <a
            href="/api/discord/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-blue-500/50"
          >
            <FaDiscord className="text-lg" />
            Login with Discord
          </a>
        </div>
      </div>
    );
  }

  if (isBanned) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-black/60 p-8 text-center backdrop-blur-xl">
          <div className="mb-4 text-5xl">🚫</div>
          <h1 className="mb-2 text-xl font-bold text-white">Access Restricted</h1>
          <p className="text-sm text-gray-400">
            Your account has been restricted from submitting song requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-4">
            <FaSpotify className="text-3xl text-white" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-4xl font-bold text-transparent">
            Song Requests
          </h1>
          <p className="text-sm text-gray-400">
            Requesting as <span className="font-semibold text-white">{user.username}</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Spotify Track Link
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                placeholder="https://open.spotify.com/track/..."
                required
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Paste a link from Spotify (open.spotify.com/track/...)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !link.trim()}
              className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-green-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaSpotify className="text-lg" />
                    Submit Request
                  </>
                )}
              </span>
            </button>

            {status && (
              <div
                className={`rounded-lg border px-4 py-3 text-center text-sm ${
                  status.includes('✓')
                    ? 'border-green-500/30 bg-green-500/10 text-green-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-400'
                }`}
              >
                {status}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Requests are moderated • Please keep it clean
        </p>
      </div>
    </div>
  );
}
