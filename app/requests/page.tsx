'use client';

import { useEffect, useState } from 'react';
import { FaMusic, FaTrash, FaEye, FaSearch, FaHome, FaSpotify, FaUser, FaBan } from 'react-icons/fa';

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
            <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
            <p className="text-zinc-400 mb-6">You need moderator permissions to access song request moderation.</p>
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
                Song Request Moderation
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
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <FaSpotify className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Song Request Queue</h2>
              <p className="text-zinc-400">Review and moderate incoming song requests</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <FaUser className="w-4 h-4" />
            <span>Logged in as <span className="text-white font-medium">{discordUser?.username}</span></span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search requests..."
                className="w-full bg-zinc-900/50 border border-zinc-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="bg-zinc-900/50 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Fields</option>
              <option value="title">Song Title</option>
              <option value="artist">Artist</option>
              <option value="user">Requested By</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <FaMusic className="text-blue-400 text-xl" />
              <div>
                <h3 className="text-sm text-zinc-400">Total Requests</h3>
                <p className="text-2xl font-bold">{requests.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <FaSearch className="text-green-400 text-xl" />
              <div>
                <h3 className="text-sm text-zinc-400">Filtered Results</h3>
                <p className="text-2xl font-bold">{filteredRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl">
            <div className="flex items-center gap-2 text-red-400">
              <FaBan />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-12 text-center">
            <FaMusic className="text-zinc-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No requests found</h3>
            <p className="text-zinc-400">
              {requests.length === 0
                ? "No song requests in the queue yet."
                : "No requests match your search criteria."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 hover:border-zinc-600 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaSpotify className="text-white text-xl" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg truncate">{req.title}</h3>
                        <p className="text-zinc-400 truncate">by {req.artist}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
                          <div className="flex items-center gap-1">
                            <FaUser className="w-3 h-3" />
                            <span>{req.requestedBy}</span>
                          </div>
                          <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 lg:flex-shrink-0">
                    <button
                      onClick={() => handleAction(req.id, 'approve')}
                      disabled={loading}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white font-medium transition"
                    >
                      <FaEye className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'reject')}
                      disabled={loading}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white font-medium transition"
                    >
                      <FaTrash className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
