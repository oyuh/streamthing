'use client';

import { useEffect, useState } from 'react';

const fetchTrack = async () => {
  const res = await fetch('/api/spotify/track');
  return res.json();
};

function msToTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export default function SpotifyOverlay() {
  const [track, setTrack] = useState<any | null>(null);
  const [lastTrack, setLastTrack] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const poll = setInterval(async () => {
      const data = await fetchTrack();

      if (!data || !data.track) {
        setShow(false);
        setLastTrack('');
        return;
      }

      const currentTrack = `${data.track} - ${data.artist}`;

      if (currentTrack !== lastTrack) {
        setTrack(data);
        setLastTrack(currentTrack);
        setShow(false);
        void document.body.offsetWidth; // force reflow
        setShow(true);
      } else {
        setTrack(data);
        setShow(true);
      }
    }, 500);

    return () => clearInterval(poll);
  }, [lastTrack]);

  return (
    <div
      id="nowPlaying"
      className={show ? 'show' : ''}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif',
        padding: '20px',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      {track && (
        <>
          <img
            id="albumArt"
            src={track.albumArt}
            alt="Album Art"
            style={{
              height: '70px',
              width: '70px',
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
            }}
          />
          <div id="info" style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              id="track"
              style={{
                fontSize: '18px',
                fontWeight: 600,
                textShadow: '0 2px 5px rgba(0,0,0,0.7)',
              }}
            >
              {track.track}
            </div>
            <div
              id="artist"
              style={{
                fontSize: '14px',
                opacity: 0.85,
                textShadow: '0 1px 3px rgba(0,0,0,0.6)',
              }}
            >
              {track.artist}
            </div>
            <div
              id="progressTime"
              style={{
                fontSize: '12px',
                opacity: 0.6,
                marginTop: '6px',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {msToTime(track.progress)} / {msToTime(track.duration)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
