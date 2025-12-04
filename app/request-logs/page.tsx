'use client';

import { useEffect, useState } from 'react';
import { FaHistory, FaSync } from 'react-icons/fa';
import PageLayout from '@/components/dashboard/PageLayout';

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

export default function RequestLogsPage() {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/spotify/request-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      } else {
        console.error('Failed to fetch logs');
      }
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchLogs();
  }, []);

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

  return (
    <PageLayout
      title="Request logs"
      icon={FaHistory}
      description="View moderation history (7 days)"
      actions={
        <button
          type="button"
          onClick={() => void fetchLogs()}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:opacity-50"
        >
          <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <p className="text-sm text-zinc-500">No logs found</p>
          </div>
        ) : (
          logs.map((log) => (
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
    </PageLayout>
  );
}
