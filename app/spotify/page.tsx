 'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { CSSProperties } from 'react';

const fetchTrack = async () => {
  const res = await fetch('/api/spotify/track');
  return res.json();
};

const fetchTheme = async (themeId?: string | null) => {
  const url = themeId
    ? `/api/spotify/themes/${themeId}`
    : '/api/spotify/themes?active=true';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch theme');
  return res.json();
};

function msToTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// Default compact widths to ensure long text starts scrolling sooner
const DEFAULT_TRACK_WIDTH = 260; // px
const DEFAULT_ARTIST_WIDTH = 220; // px
const MIN_TRACK_WIDTH = 140; // px
const MIN_ARTIST_WIDTH = 120; // px
const MAX_TRACK_WIDTH = 360; // px
const MAX_ARTIST_WIDTH = 280; // px

// Auto-scroll long single-line text when it overflows its container
function AutoScrollText({
  text,
  elementId,
  className,
  style,
  speed = 45, // px per second
  cutoffAt,
}: {
  text: string;
  elementId: string; // use the original id (e.g., 'track', 'artist') for theme CSS
  className?: string;
  style?: CSSProperties;
  speed?: number;
  cutoffAt?: string | RegExp;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null); // measure single segment
  const scrollerRef = useRef<HTMLDivElement | null>(null); // element we animate
  const measureRef = useRef<HTMLSpanElement | null>(null); // hidden measurer
  const animRef = useRef<Animation | null>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const gap = 32; // px gap between duplicates

  useEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      const t = textRef.current;
      if (!c || !t) return;
      // Smart cutoff width based on delimiter position
      if (cutoffAt && measureRef.current) {
        let idx = -1;
        if (typeof cutoffAt === 'string') {
          idx = text.indexOf(cutoffAt);
        } else {
          const m = text.match(cutoffAt);
          idx = m?.index ?? -1;
        }
        if (idx > 0) {
          const prefix = text.slice(0, idx).trimEnd();
          measureRef.current.textContent = prefix || text;
          const measured = Math.ceil(measureRef.current.scrollWidth + 6);
          const minW = elementId === 'track' ? MIN_TRACK_WIDTH : MIN_ARTIST_WIDTH;
          const maxW = elementId === 'track' ? MAX_TRACK_WIDTH : MAX_ARTIST_WIDTH;
          const clamped = Math.max(minW, Math.min(maxW, measured));
          const varName = elementId === 'track' ? '--track-width' : '--artist-width';
          c.style.setProperty(varName, `${clamped}px`);
          // Share the track width so artist lines up with the same cutoff
          if (elementId === 'track') {
            document.documentElement.style.setProperty('--smart-track-width', `${clamped}px`);
          }
        }
      }

      const cW = c.clientWidth;
      const tW = t.scrollWidth;
      if (tW > cW + 1) {
        const dist = tW + gap; // continuous loop distance
        setDistance(dist);
        setDuration(Math.max(6, dist / speed));
        setShouldScroll(true);
      } else {
        setShouldScroll(false);
        setDistance(0);
        setDuration(0);
      }
    };

    measure();
    // Re-measure after fonts load/settle
    const t1 = setTimeout(measure, 250);
    const t2 = setTimeout(measure, 800);
    window.addEventListener('resize', measure);
    // Observe container/text size changes (fonts, dynamic CSS)
    const roC = new ResizeObserver(() => measure());
    const roT = new ResizeObserver(() => measure());
    if (containerRef.current) roC.observe(containerRef.current);
    if (textRef.current) roT.observe(textRef.current);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', measure);
      roC.disconnect();
      roT.disconnect();
    };
  }, [text, speed]);

  // Drive animation using Web Animations API where available (animate scroller)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Clear previous animation
    animRef.current?.cancel();
    animRef.current = null;

    // Reset styles
    el.style.animation = '';
    el.style.transform = 'translateX(0)';

    if (!shouldScroll || distance <= 0 || duration <= 0) {
      return;
    }

    if (typeof (el as any).animate === 'function') {
      animRef.current = el.animate(
        [
          { transform: 'translateX(0)' },
          { transform: `translateX(${-distance}px)` },
        ],
        {
          duration: duration * 1000,
          iterations: Infinity,
          easing: 'linear',
        }
      );
    }

    // Also set CSS animation as a secondary path to avoid browser WAAPI quirks in overlays
    el.style.setProperty('--st-distance', `${distance}px`);
    el.style.animationName = 'st-loop-x';
    el.style.animationDuration = `${duration}s`;
    el.style.animationTimingFunction = 'linear';
    el.style.animationIterationCount = 'infinite';
    el.style.animationDirection = 'normal';

    return () => {
      animRef.current?.cancel();
      animRef.current = null;
    };
  }, [shouldScroll, distance, duration]);

  const enforcedWidth = style?.width; // rely on CSS rule for defaults; only honor explicit style width

  return (
    <div
      id={elementId}
      ref={containerRef}
      className={className}
      style={{
        ...style,
        flex: '0 1 auto',
        ...(enforcedWidth ? { width: enforcedWidth as any } : {}),
        minWidth: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'relative',
      }}
    >
      <div
        ref={scrollerRef}
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: `${gap}px`,
          willChange: shouldScroll ? 'transform' : undefined,
        }}
      >
        <div
          ref={textRef}
          style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          {text}
        </div>
        {shouldScroll && (
          <div aria-hidden="true" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {text}
          </div>
        )}
        {/* Hidden measurer for smart cutoff */}
        <span
          ref={measureRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}

// Utility: remove common noisy version tags from titles and clamp to a max length
function cleanTitle(title: string): string {
  let t = title;
  // Remove trailing " - 20xx Remaster/Remastered"
  t = t.replace(/\s*-\s*\d{4}\s*Remaster(?:ed)?\b.*$/i, '');
  t = t.replace(/\s*-\s*Remaster(?:ed)?\b.*$/i, '');
  // Remove common version parentheticals
  t = t.replace(/\s*\((?:Single|Radio|Mono|Stereo|Remaster(?:ed)?|Version|Edit|Live|Deluxe|Extended|Acoustic|Demo|Remix|Re-?recorded)[^)]*\)\s*/gi, ' ');
  // Collapse whitespace
  t = t.replace(/\s{2,}/g, ' ').trim();
  return t;
}

export default function SpotifyOverlay() {
  const searchParams = useSearchParams();
  const themeId = searchParams.get('theme');
  const [track, setTrack] = useState<any | null>(null);
  const [lastTrack, setLastTrack] = useState('');
  const [show, setShow] = useState(false);
  const [activeTheme, setActiveTheme] = useState<any | null>(null);
  const [artistColor, setArtistColor] = useState<string>('');
  const [authError, setAuthError] = useState(false);

  // Built-in fallback CSS (Dark Minimal) if no theme is active
  const fallbackCSS = `#nowPlaying { --artist-accent: #9ca3af; display:flex; align-items:center; gap:10px; color:#e5e7eb; font-family:'Segoe UI', system-ui, -apple-system, sans-serif; padding:10px 12px; border-radius:10px; background:rgba(0,0,0,0.35); box-shadow:0 4px 18px rgba(0,0,0,0.45); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); transition:opacity .4s ease } #albumArt{ height:40px; width:40px; object-fit:cover; border-radius:9px; box-shadow:0 4px 12px rgba(0,0,0,.6) } #info{ display:flex; flex-direction:column } #track{ font-size:15px; line-height:1.1; font-weight:700; text-shadow:0 1px 3px rgba(0,0,0,.65); color:#f9fafb } #artist{ margin-top:2px; font-size:13px; line-height:1; color:var(--artist-accent); text-shadow:0 1px 2px rgba(0,0,0,.5) } #progressTime{ margin-top:3px; font-size:11px; letter-spacing:.2px; color:#94a3b8; opacity:.9; text-shadow:0 1px 2px rgba(0,0,0,.4) }`;

  useEffect(() => {
    // Fetch the active theme or specific theme from params
    const loadTheme = async () => {
      try {
        const theme = await fetchTheme(themeId);
        setActiveTheme(theme);
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();
  }, [themeId]);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const data = await fetchTrack();

        // Check if it's an auth error
        if (data?.error && (data.error.includes('Unauthorized') || data.error.includes('No token'))) {
          setAuthError(true);
          setShow(false);
          return;
        }

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

        setAuthError(false);
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
      {/* Keyframes fallback if Web Animations API is unavailable */}
      <style>{`
        @keyframes st-scroll-x {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-1 * var(--st-distance, 0px))); }
        }
        @keyframes st-loop-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-1 * var(--st-distance, 0px))); }
        }
      `}</style>
      {/* Enforce marquee prerequisites regardless of theme CSS */}
      <style>{`
        #info { min-width: 0 !important; }
        #track, #artist {
          overflow: hidden !important;
          white-space: nowrap !important;
          display: block !important;
          max-width: min(75vw, 560px) !important;
        }
      `}</style>
      {/* Force compact widths even if a theme tries to override with !important; allow theme to tune via CSS vars.
          If AutoScrollText computes a smart cutoff for the track, both will align to it via --smart-track-width. */}
      <style>{`
        #track { width: var(--track-width, var(--smart-track-width, ${DEFAULT_TRACK_WIDTH}px)) !important; }
        #artist { width: var(--artist-width, var(--smart-track-width, ${DEFAULT_ARTIST_WIDTH}px)) !important; }
      `}</style>

      {authError && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}>
          <a
            href="/api/spotify/auth?login=true"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 24px',
              background: 'rgba(0, 0, 0, 0.9)',
              border: '1px solid rgba(30, 215, 96, 0.3)',
              borderRadius: '12px',
              color: '#1ed760',
              textDecoration: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(30, 215, 96, 0.1)';
              e.currentTarget.style.borderColor = '#1ed760';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
              e.currentTarget.style.borderColor = 'rgba(30, 215, 96, 0.3)';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Connect Spotify</span>
          </a>
        </div>
      )}

      <div
        id="nowPlaying"
        style={{
          opacity: show ? 1 : 0,
          // Ensure layout works regardless of theme CSS
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {track && (
          <>
            <img
              id="albumArt"
              src={track.albumArt}
              alt="Album Art"
            />
            <div
              id="info"
              style={{
                // Ensure text containers have a horizontal constraint
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                maxWidth: 'min(75vw, 560px)',
              }}
            >
              <AutoScrollText elementId="track" text={cleanTitle(track.track)} cutoffAt="-" />
              <AutoScrollText
                elementId="artist"
                text={track.artist}
                cutoffAt=","
                style={{ color: 'var(--artist-accent)' }}
              />
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
