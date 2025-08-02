'use client';

import { useEffect, useState } from 'react';
import { FaSpotify, FaMusic, FaUser, FaBan, FaHome, FaPaperPlane } from 'react-icons/fa';

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

  if (isBanned) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-slate-900 to-black text-white">
        {/* Header */}
        <header className="bg-zinc-900/50 border-b border-zinc-700 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FaBan className="text-red-400 text-2xl" />
                <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
              </div>
              <a
                href="/"
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition"
              >
                <FaHome />
                Back to Dashboard
              </a>
            </div>
          </div>
        </header>

        <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBan className="text-red-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold mb-4">You are banned</h2>
            <p className="text-zinc-400 mb-6">You have been banned from submitting song requests.</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg transition"
            >
              <FaHome />
              Return to Dashboard
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-slate-900 to-black text-white">
      {/* Header */}
      <header className="bg-zinc-900/50 border-b border-zinc-700 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FaMusic className="text-green-400 text-2xl" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
                Song Requests
              </h1>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition"
            >
              <FaHome />
              Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {!user ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUser className="text-indigo-400 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Login Required</h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              You must be logged in with Discord to submit song requests.
            </p>
            <a
              href="/api/discord/login"
              className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-lg text-white font-semibold shadow-lg transition text-lg"
            >
              <FaUser />
              Login with Discord
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSpotify className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Request a Song</h2>
              <p className="text-zinc-400 mb-6">
                Share a Spotify track link and it will be added to the request queue for review.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                <FaUser className="w-4 h-4" />
                <span>Logged in as <span className="text-white font-medium">{user.username}</span></span>
              </div>
            </div>

            {/* Request Form */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Spotify Track URL
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://open.spotify.com/track/..."
                    className="w-full bg-zinc-900/50 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                  <p className="text-xs text-zinc-500 mt-2">
                    Copy the share link from any Spotify track
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-zinc-600 disabled:to-zinc-500 disabled:cursor-not-allowed px-6 py-4 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Submit Request
                    </>
                  )}
                </button>
              </form>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="mt-6 p-4 bg-green-900/50 border border-green-700 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400">
                    <FaMusic />
                    <span className="font-medium">Song request submitted successfully!</span>
                  </div>
                  <p className="text-green-300 text-sm mt-1">
                    Your request is now in the queue for review.
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400">
                    <FaBan />
                    <span className="font-medium">Request failed</span>
                  </div>
                  <p className="text-red-300 text-sm mt-1">{errorMsg}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
