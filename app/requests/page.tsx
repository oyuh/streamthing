'use client';

import { useEffect, useState } from 'react';

type SongRequest = {
  id: string;
  link: string;
  requestedBy: string;
  createdAt: string;
  status: string;
  title: string | null;
  artist: string | null;

};

export default function SongRequestModerationPage() {
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [discordUser, setDiscordUser] = useState<{ id: string; username: string } | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(user => {
        if (!user?.id) return setUnauthorized(true);

        const allowedIds = process.env.NEXT_PUBLIC_ALLOWED_DISCORD_USERS?.split(',') || [];
        if (!allowedIds.includes(user.id)) {
          setUnauthorized(true);
        } else {
          setDiscordUser(user);
          fetchRequests();
        }
      });
  }, []);

  async function fetchRequests() {
    const res = await fetch('/api/spotify/requests');
    const data = await res.json();
    if (res.ok) {
      setRequests(data);
    } else {
      setError(data.error || 'Failed to load');
    }
  }

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setLoading(true);
    setError('');

    const res = await fetch('/api/spotify/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });

    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to update request');
    }

    setLoading(false);
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg text-zinc-400">You are not authorized to view this page.</p>
      </div>
    );
  }

  if (!discordUser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <a
          href="/api/discord/login"
          className="bg-indigo-600 px-6 py-3 rounded-lg text-white font-semibold shadow"
        >
          Login with Discord
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-zinc-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-white drop-shadow">
          🎧 Song Requests Moderation
        </h1>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <p className="text-zinc-400 text-center">No pending song requests.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((req) => (
              <li
                key={req.id}
                className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-white">
                    {req.title
                      ? `${req.title} – ${req.artist}`
                      : req.link}
                  </p>
                  <p className="text-sm text-zinc-400">
                    Requested by {req.requestedBy}
                  </p>
                </div>

                <div className="flex gap-3 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleAction(req.id, 'approve')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
                    disabled={loading}
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleAction(req.id, 'reject')}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
                    disabled={loading}
                  >
                    ❌ Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
