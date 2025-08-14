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
  const [artistColor, setArtistColor] = useState<string>('');

  // Built-in fallback CSS (Dark Minimal) if no theme is active
  const fallbackCSS = `#nowPlaying { --artist-accent: #9ca3af; display:flex; align-items:center; gap:10px; color:#e5e7eb; font-family:'Segoe UI', system-ui, -apple-system, sans-serif; padding:10px 12px; border-radius:10px; background:rgba(0,0,0,0.35); box-shadow:0 4px 18px rgba(0,0,0,0.45); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); transition:opacity .4s ease } #albumArt{ height:40px; width:40px; object-fit:cover; border-radius:9px; box-shadow:0 4px 12px rgba(0,0,0,.6) } #info{ display:flex; flex-direction:column } #track{ font-size:15px; line-height:1.1; font-weight:700; text-shadow:0 1px 3px rgba(0,0,0,.65); color:#f9fafb } #artist{ margin-top:2px; font-size:13px; line-height:1; color:var(--artist-accent); text-shadow:0 1px 2px rgba(0,0,0,.5) } #progressTime{ margin-top:3px; font-size:11px; letter-spacing:.2px; color:#94a3b8; opacity:.9; text-shadow:0 1px 2px rgba(0,0,0,.4) }`;

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

  // Compute average color from album art and expose as CSS var
  useEffect(() => {
    if (!track?.albumArt) return;

    const img = new Image();
    // Route through same-origin proxy to avoid tainting canvas
    const proxied = `/api/spotify/album-art?src=${encodeURIComponent(track.albumArt)}`;
    img.crossOrigin = 'anonymous';
    img.src = proxied;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        // Downscale for speed
        const w = 24;
        const h = 24;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 10) continue; // skip transparent
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          // Contrast boost and slight desaturation for readability
          const desat = 0.85;
          const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          r = Math.round(r * desat + gray * (1 - desat));
          g = Math.round(g * desat + gray * (1 - desat));
          b = Math.round(b * desat + gray * (1 - desat));

          const color = `rgb(${r}, ${g}, ${b})`;
          setArtistColor(color);
          document.documentElement.style.setProperty('--artist-accent', color);
        }
      } catch (e) {
        console.warn('Average color failed:', e);
      }
    };
  }, [track?.albumArt]);

  return (
    <>
      {/* Dynamic CSS from database */}
  <style dangerouslySetInnerHTML={{ __html: activeTheme?.css || fallbackCSS }} />

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
              <div id="artist" style={{ color: 'var(--artist-accent)' }}>
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
