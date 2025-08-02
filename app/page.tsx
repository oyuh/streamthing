'use client';

import { useEffect, useState } from 'react';
import {
  FaSpotify,
  FaDiscord,
  FaMusic,
  FaList,
  FaUsers,
  FaCalendarAlt,
  FaTwitch,
  FaEye,
  FaLink,
  FaPalette
} from 'react-icons/fa';

function StatusIndicator({ label, connected }: { label: string; connected: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
        title={connected ? 'Connected' : 'Not Connected'}
      />
      <span className="text-sm font-medium">{label}: {connected ? 'Connected' : 'Not Connected'}</span>
    </div>
  );
}

export default function Home() {
  const [discordUser, setDiscordUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<any | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [spotifyStatus, setSpotifyStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const [twitchStatus, setTwitchStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const [versionInfo, setVersionInfo] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data && data.username) {
          setDiscordUser(data);
          fetch(`/api/users/${data.id}/role`)
            .then(res => res.json())
            .then(role => {
              setUserRole(role);
              if (!role?.isModerator) {
                setUnauthorized(true);
              }
            });
        }
      });

    // Fetch version info
    fetch('/api/version')
      .then(res => res.json())
      .then(data => setVersionInfo(data))
      .catch(err => console.error('Failed to fetch version info:', err));
  }, []);

  useEffect(() => {
    if (unauthorized) {
      alert('You are not authorized to view this page.');
      window.close();
    }
  }, [unauthorized]);

  useEffect(() => {
    if (discordUser) {
      // Spotify: check if /api/spotify/track returns a track
      setSpotifyStatus('loading');
      fetch('/api/spotify/track')
        .then(res => res.json())
        .then(data => {
          if (data && Object.keys(data).length > 0) {
            setSpotifyStatus('connected');
          } else {
            setSpotifyStatus('disconnected');
          }
        })
        .catch(() => setSpotifyStatus('disconnected'));

      // Set Twitch as disconnected since it's not implemented yet
      setTwitchStatus('disconnected');
    }
  }, [discordUser]);

  if (!discordUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center text-white">
        <div className="bg-zinc-800 rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold mb-2">Welcome to Streamthing</h1>
          <p className="mb-4 text-zinc-300">Please log in to access your dashboard.</p>
          <a
            href="/api/discord/login"
            className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-lg text-white font-semibold shadow-lg transition text-lg flex items-center gap-3"
          >
            <FaDiscord size={24} />
            Login with Discord
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white flex flex-col items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-2xl bg-zinc-800/80 rounded-2xl shadow-2xl p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold drop-shadow-md mb-1">
              streamthing ({versionInfo ? versionInfo.commitHash : '...'})
            </h1>
            <div className="text-zinc-300 text-sm space-y-1">
              <p>{new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              {versionInfo && (
                <p>
                  <a
                    href={versionInfo.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    view commit
                  </a>
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-[180px]">
            <StatusIndicator label="Spotify" connected={spotifyStatus === 'connected'} />
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-500" title="Not Available" />
              <span className="text-sm font-medium">Twitch: Not Available</span>
            </div>
          </div>
        </div>
        <div className="grid gap-4 w-full grid-cols-1 md:grid-cols-2">
          {/* Spotify Connect/Overlay - Only for moderators */}
          {userRole?.isModerator && (
            <a
              href="/api/spotify/auth?login=true"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-black font-bold text-center py-4 px-4 rounded-lg shadow-lg transition text-lg justify-center"
            >
              <FaSpotify size={24} />
              Spotify Connect & Overlay
            </a>
          )}

          {/* Twitch Connect - Disabled for now */}
          <div className="flex items-center gap-3 bg-gray-500 text-gray-300 font-bold text-center py-4 px-4 rounded-lg shadow-lg text-lg justify-center cursor-not-allowed opacity-50">
            <FaTwitch size={24} />
            Twitch
          </div>

          {/* Twitch Events - Disabled for now */}
          <div className="flex items-center gap-3 bg-gray-500 text-gray-300 font-bold text-center py-4 px-4 rounded-lg shadow-lg text-lg justify-center cursor-not-allowed opacity-50">
            <FaCalendarAlt size={24} />
            Twitch Events
          </div>

          {/* Request a Song - Available to all users */}
          <a
            href="/request-song"
            className="flex items-center gap-3 bg-lime-500 hover:bg-lime-600 text-black font-bold text-center py-4 px-4 rounded-lg shadow-lg transition text-lg justify-center"
          >
            <FaMusic size={24} />
            Request a Song
          </a>

          {/* Mod Panel: Song Requests - Only for moderators */}
          {userRole?.isModerator && (
            <a
              href="/requests"
              className="flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold text-center py-4 px-4 rounded-lg shadow-lg transition text-lg justify-center"
            >
              <FaList size={24} />
              Mod Panel: Song Requests
            </a>
          )}

          {/* Mod Panel: Users - Only for moderators */}
          {userRole?.isModerator && (
            <a
              href="/admin/users"
              className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-center py-4 px-4 rounded-lg shadow-lg transition text-lg justify-center"
            >
              <FaUsers size={24} />
              Mod Panel: Users
            </a>
          )}

          {/* Theme Editor - Only for moderators */}
          {userRole?.isModerator && (
            <a
              href="/admin/themes"
              className="flex items-center gap-3 bg-purple-500 hover:bg-purple-600 text-white font-bold text-center py-4 px-4 rounded-lg shadow-lg transition text-lg justify-center"
            >
              <FaPalette size={24} />
              Spotify Theme Editor
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
