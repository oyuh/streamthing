'use client';

import { useEffect, useState } from 'react';
import { FaBan, FaCheck, FaList, FaSync, FaTimes, FaSearch } from 'react-icons/fa';
import PageLayout from '@/components/dashboard/PageLayout';

type Request = {
  id: string;
  title: string;
  artist: string;
  requestedBy: string;
  createdAt: string;
  userId: string | null;
  userAvatar: string | null;
};

type RequestLog = {
  id: string;
  requestId: string;
  action: string;
  moderatorId: string;
  moderatorUsername: string;
  requestedBy: string;
  songTitle: string;
  songArtist: string;
  createdAt: string;
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [requestSearch, setRequestSearch] = useState('');
  const [logSearch, setLogSearch] = useState('');
  const [showBanModal, setShowBanModal] = useState(false);
  const [showClearLogsModal, setShowClearLogsModal] = useState(false);
  const [banTarget, setBanTarget] = useState<{ id: string; username: string } | null>(null);
  const [banReason, setBanReason] = useState('');
  const [isStreamer, setIsStreamer] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/spotify/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch('/api/spotify/request-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchUserRole = async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setIsStreamer(data.isStreamer || false);
      }
    } catch (error) {
      console.error('Failed to fetch user role', error);
    }
  };

  const clearLogs = async () => {
    try {
      const res = await fetch('/api/spotify/request-logs', { method: 'DELETE' });
      if (res.ok) {
        await fetchLogs();
        setShowClearLogsModal(false);
      } else {
        alert('Failed to clear logs');
      }
    } catch (error) {
      console.error('Failed to clear logs', error);
      alert('Failed to clear logs');
    }
  };

  useEffect(() => {
    void fetchRequests();
    void fetchLogs();
    void fetchUserRole();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject', banUser = false, banReason?: string) => {
    try {
      const res = await fetch('/api/spotify/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, banUser, banReason }),
      });

      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        // Refresh logs after action
        void fetchLogs();
      } else {
        const data = await res.json();
        alert(data.error || 'Action failed');
      }
    } catch (error) {
      console.error('Action failed', error);
      alert('Action failed');
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'approved':
        return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'rejected':
        return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'banned':
        return 'bg-orange-600/20 text-orange-400 border-orange-600/30';
      default:
        return 'bg-zinc-600/20 text-zinc-400 border-zinc-600/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const filteredRequests = requests.filter((req) => {
    if (!requestSearch) return true;
    const search = requestSearch.toLowerCase();
    return (
      req.title.toLowerCase().includes(search) ||
      req.artist.toLowerCase().includes(search) ||
      req.requestedBy.toLowerCase().includes(search)
    );
  });

  const filteredLogs = logs.filter((log) => {
    if (!logSearch) return true;
    const search = logSearch.toLowerCase();
    return (
      log.songTitle.toLowerCase().includes(search) ||
      log.songArtist.toLowerCase().includes(search) ||
      log.requestedBy.toLowerCase().includes(search) ||
      log.moderatorUsername.toLowerCase().includes(search) ||
      log.action.toLowerCase().includes(search)
    );
  });

  return (
    <PageLayout
      title="Song requests"
      icon={FaList}
      description="Moderate the queue"
      actions={
        <button
          type="button"
          onClick={() => {
            void fetchRequests();
            void fetchLogs();
          }}
          disabled={loading || logsLoading}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:opacity-50"
        >
          <FaSync className={`text-xs ${loading || logsLoading ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      <div className="space-y-6">
        {/* Pending Requests Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Pending Requests</h2>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500" />
              <input
                type="text"
                placeholder="Search requests..."
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                className="h-9 w-64 rounded-lg border border-zinc-800 bg-zinc-900/50 pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-700 focus:outline-none"
              />
            </div>
          </div>
          {filteredRequests.length === 0 ? (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
              <p className="text-sm text-zinc-500">
                {requestSearch ? 'No requests match your search' : 'No pending requests'}
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <img
                  src={
                    req.userId && req.userAvatar
                      ? `https://cdn.discordapp.com/avatars/${req.userId}/${req.userAvatar}.png`
                      : req.userId
                      ? `https://cdn.discordapp.com/embed/avatars/${parseInt(req.userId) % 5}.png`
                      : `https://cdn.discordapp.com/embed/avatars/0.png`
                  }
                  alt=""
                  className="h-8 w-8 rounded-full flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = `https://cdn.discordapp.com/embed/avatars/0.png`;
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{req.title}</p>
                  <p className="text-xs text-zinc-500 mb-1">
                    {req.artist} · {req.requestedBy}
                  </p>
                  <p className="text-xs text-zinc-600">
                    {formatDate(req.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleAction(req.id, 'approve')}
                  className="flex h-8 w-8 items-center justify-center rounded border border-zinc-700 bg-white/5 text-white transition hover:border-green-600 hover:bg-green-600/10"
                  title="Approve request"
                >
                  <FaCheck className="text-xs" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleAction(req.id, 'reject')}
                  className="flex h-8 w-8 items-center justify-center rounded border border-zinc-700 bg-white/5 text-white transition hover:border-red-600 hover:bg-red-600/10"
                  title="Reject request"
                >
                  <FaTimes className="text-xs" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBanTarget({ id: req.id, username: req.requestedBy });
                    setBanReason('');
                    setShowBanModal(true);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded border border-zinc-700 bg-white/5 text-white transition hover:border-orange-600 hover:bg-orange-600/10"
                  title="Ban user and reject"
                >
                  <FaBan className="text-xs" />
                </button>
              </div>
            </div>
          ))
        )}
        </div>

        {/* Request Logs Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Activity (7 days)</h2>
            <div className="flex items-center gap-3">
              {isStreamer && (
                <button
                  type="button"
                  onClick={() => setShowClearLogsModal(true)}
                  className="rounded-lg border border-red-900 bg-red-950/30 px-3 py-1.5 text-xs text-red-400 transition hover:border-red-700"
                >
                  Clear Logs
                </button>
              )}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="h-9 w-64 rounded-lg border border-zinc-800 bg-zinc-900/50 pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-700 focus:outline-none"
                />
              </div>
            </div>
          </div>
          {filteredLogs.length === 0 ? (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
              <p className="text-sm text-zinc-500">
                {logSearch ? 'No logs match your search' : 'No activity logs yet'}
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getActionBadgeColor(log.action)}`}>
                        {log.action.toUpperCase()}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white mb-1">
                      {log.songTitle}
                    </p>
                    <p className="text-xs text-zinc-500 mb-2">
                      {log.songArtist}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span>
                        Requested by: <span className="text-white">{log.requestedBy}</span>
                      </span>
                      <span>•</span>
                      <span>
                        Moderator: <span className="text-white">{log.moderatorUsername}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ban Modal */}
      {showBanModal && banTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Ban User</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Ban <span className="text-white font-medium">{banTarget.username}</span> and reject this request?
            </p>
            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter ban reason..."
                rows={3}
                className="w-full rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowBanModal(false);
                  setBanTarget(null);
                  setBanReason('');
                }}
                className="flex-1 rounded border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleAction(banTarget.id, 'reject', true, banReason || undefined);
                  setShowBanModal(false);
                  setBanTarget(null);
                  setBanReason('');
                }}
                className="flex-1 rounded border border-red-900 bg-red-950/30 px-4 py-2 text-sm text-red-400 transition hover:border-red-700"
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Logs Confirmation Modal */}
      {showClearLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Clear All Logs</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Are you sure you want to clear all request logs? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowClearLogsModal(false)}
                className="flex-1 rounded border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void clearLogs()}
                className="flex-1 rounded border border-red-900 bg-red-950/30 px-4 py-2 text-sm text-red-400 transition hover:border-red-700"
              >
                Clear All Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
