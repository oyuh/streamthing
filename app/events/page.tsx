'use client';
import { useEffect, useState } from 'react';

type Event = {
  id: string;
  username: string;
  type: string;
};

export default function EventsOverlay() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/twitch/events');
      const data = await res.json();
      setEvents(data);
    };

    load();
    const interval = setInterval(load, 5000); // refresh every 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      fontFamily: 'Arial Black, sans-serif',
      color: 'white',
      fontSize: '18px',
      lineHeight: '1.6',
      padding: '20px',
    }}>
      {events.map(event => (
        <div key={event.id}>
          <span style={{ fontWeight: 'bold' }}>{event.username}</span> FOLLOW
        </div>
      ))}
    </div>
  );
}
