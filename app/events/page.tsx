'use client';
import { useEffect, useState } from 'react';

export default function TwitchEvents() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/twitch/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  return (
    <div>
      {events.map((event, i) => (
        <div key={i}>{event.type}</div>
      ))}
    </div>
  );
}
