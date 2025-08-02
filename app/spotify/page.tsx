'use client';

import { useEffect, useState } from 'react';

const fetchTrack = async () => {
  const res = await fetch('/api/spotify/track');
  return res.json();
};

const fetchActiveTheme = async () => {
  const res = await fetch('/api/spotify/themes?active=true');
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
  const [activeTheme, setActiveTheme] = useState<any | null>(null);

  useEffect(() => {
    // Fetch the active theme
    const loadTheme = async () => {
      try {
        const theme = await fetchActiveTheme();
        setActiveTheme(theme);
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const data = await fetchTrack();

        // If we get no data or an error, keep showing the last known track
        if (!data || !data.track) {
          // Only hide if we've never had a track before
          if (!track) {
            setShow(false);
            setLastTrack('');
          }
          // If we had a track before, keep showing it
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
      } catch (error) {
        console.error('Failed to fetch track:', error);
        // Don't hide the overlay on error - keep showing last known track
      }
    }, 500);

    return () => clearInterval(poll);
  }, [lastTrack, track]);

  return (
    <>
      {/* Dynamic CSS from database */}
      {activeTheme && (
        <style dangerouslySetInnerHTML={{ __html: activeTheme.css }} />
      )}

      <div
        id="nowPlaying"
        style={{
          opacity: show ? 1 : 0,
        }}
      >
        {track && (
          <>
            <img
              id="albumArt"
              src={track.albumArt}
              alt="Album Art"
            />
            <div id="info">
              <div id="track">
                {track.track}
              </div>
              <div id="artist">
                {track.artist}
              </div>
              <div id="progressTime">
                {msToTime(track.progress)} / {msToTime(track.duration)}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
