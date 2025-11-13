'use client';

import { useEffect, useState } from 'react';
import { FaCheck, FaList, FaSync, FaTimes } from 'react-icons/fa';
import PageLayout from '@/components/dashboard/PageLayout';

type Request = {
  id: string;
  title: string;
  artist: string;
  requestedBy: string;
  createdAt: string;
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    void fetchRequests();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/spotify/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error('Action failed', error);
    }
  };

  return (
    <PageLayout
      title="Song requests"
      icon={FaList}
      description="Moderate the queue"
      actions={
        <button
          type="button"
          onClick={() => void fetchRequests()}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:opacity-50"
        >
          <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <p className="text-sm text-zinc-500">No pending requests</p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{req.title}</p>
                <p className="text-xs text-zinc-500">
                  {req.artist} · {req.requestedBy}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleAction(req.id, 'approve')}
                  className="flex h-8 w-8 items-center justify-center rounded border border-zinc-700 bg-white/5 text-white transition hover:border-green-600 hover:bg-green-600/10"
                >
                  <FaCheck className="text-xs" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleAction(req.id, 'reject')}
                  className="flex h-8 w-8 items-center justify-center rounded border border-zinc-700 bg-white/5 text-white transition hover:border-red-600 hover:bg-red-600/10"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}
