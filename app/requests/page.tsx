'use client';

import { useEffect, useState } from 'react';

type SongRequest = {
  id: string;
  spotifyUri: string;
  title: string;
  artist: string;
  requestedBy: string;
  createdAt: string;
};

export default function SongRequestModerationPage() {
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'title' | 'artist' | 'user'>('all');
  const [discordUser, setDiscordUser] = useState<{ id: string; username: string } | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(async data => {
        if (data?.id) {
          const res = await fetch(`/api/users/${data.id}/role`);
          const role = await res.json();

          if (role?.isBanned || !role?.isModerator) {
            setUnauthorized(true);
            return;
          }

          setDiscordUser(data);
          fetchRequests();
        } else {
          setUnauthorized(true);
        }
      });
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/spotify/requests');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load song requests');
    }
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/spotify/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Something went wrong');
        return;
      }

      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      setError('Server error.');
    }

    setLoading(false);
  };

  const filteredRequests = requests.filter(req => {
    const query = search.toLowerCase();
    switch (filterBy) {
      case 'title':
        return req.title.toLowerCase().includes(query);
      case 'artist':
        return req.artist.toLowerCase().includes(query);
      case 'user':
        return req.requestedBy.toLowerCase().includes(query);
      default:
        return (
          req.title.toLowerCase().includes(query) ||
          req.artist.toLowerCase().includes(query) ||
          req.requestedBy.toLowerCase().includes(query)
        );
    }
  });

  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        ❌ You are not authorized to view this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-zinc-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-white drop-shadow">
          🎧 Song Requests Moderation
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 px-4 py-2 rounded bg-zinc-800 border border-zinc-700 text-white"
          />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="bg-zinc-800 text-white px-4 py-2 rounded border border-zinc-700"
          >
            <option value="all">All</option>
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="user">Requested By</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4 text-center">
            ❌ {error}
          </div>
        )}

        {filteredRequests.length === 0 ? (
          <p className="text-zinc-400 text-center">No matching song requests found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredRequests.map((req) => (
              <li
                key={req.id}
                className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-white">{req.title} – {req.artist}</p>
                  <p className="text-sm text-zinc-400">Requested by {req.requestedBy}</p>
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
