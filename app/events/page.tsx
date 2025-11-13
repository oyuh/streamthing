'use client';

import PageLayout from '@/components/dashboard/PageLayout';
import { useEffect, useState } from 'react';
import { FaCalendar, FaSync } from 'react-icons/fa';

export default function TwitchEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/twitch/events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEvents();
  }, []);

  return (
    <PageLayout
      title="Events"
      icon={FaCalendar}
      description="Twitch activity"
      actions={
        <button
          type="button"
          onClick={() => void fetchEvents()}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:opacity-50"
        >
          <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <p className="text-sm text-zinc-500">No events yet</p>
          </div>
        ) : (
          events.map((event, i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
            >
              <p className="text-sm font-medium text-white">{event.type}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {new Date(event.timestamp || Date.now()).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}
