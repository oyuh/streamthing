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
  FaPalette,
  FaRocket,
  FaCog,
  FaPlay,
  FaHeart,
  FaCrown
} from 'react-icons/fa';
import LandingPage from './components/LandingPage';

export default function Home() {
  const [discordUser, setDiscordUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<any | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [versionInfo, setVersionInfo] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data && data.username) {
          setDiscordUser(data);
          setUserRole(data); // Use the role info from the same API call
          if (!data.isModerator && !data.isStreamer) {
            setUnauthorized(true);
          }
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

  if (!discordUser) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white relative">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-48 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-6 py-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <FaRocket className="text-lg text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    streamthing
                  </h1>
                  <p className="text-gray-400">Control Center</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500">
                  {discordUser?.avatar ? (
                    <img
                      src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`}
                      alt={discordUser.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaDiscord className="text-white text-sm" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{discordUser?.username}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                    userRole?.isStreamer
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      : userRole?.isModerator
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}>
                    {userRole?.isStreamer ? (
                      <>
                        <FaCrown className="w-3 h-3" />
                        Streamer
                      </>
                    ) : userRole?.isModerator ? (
                      'Moderator'
                    ) : (
                      'User'
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="text-gray-400 text-sm">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {versionInfo && (
                <p className="text-xs">
                  <span className="text-gray-500">Version: </span>
                  <a
                    href={versionInfo.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors font-mono"
                  >
                    {versionInfo.commitHash}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Song Request Card - Always visible */}
            <a
              href="/request-song"
              className="group block bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-emerald-500/50 rounded-xl p-6 transition-all duration-200 hover:bg-gray-800/70"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <FaMusic className="text-white" />
                </div>
                <FaPlay className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Request a Song</h3>
              <p className="text-gray-400 text-sm mb-3">Submit music requests for the stream</p>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                <span>Make Request</span>
                <FaMusic className="text-xs" />
              </div>
            </a>

            {/* Moderator Cards */}
            {userRole?.isModerator && (
              <>
                {/* Spotify Connect */}
                <a
                  href="/api/spotify/auth?login=true"
                  className="group block bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-green-500/50 rounded-xl p-6 transition-all duration-200 hover:bg-gray-800/70"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                      <FaSpotify className="text-white" />
                    </div>
                    <FaLink className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Spotify Connect</h3>
                  <p className="text-gray-400 text-sm mb-3">Link your Spotify account and access overlay</p>
                  <div className="flex items-center gap-2 text-green-400 text-xs font-medium">
                    <span>Connect Now</span>
                    <FaSpotify className="text-xs" />
                  </div>
                </a>

                {/* Song Requests Moderation */}
                <a
                  href="/requests"
                  className="group block bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-red-500/50 rounded-xl p-6 transition-all duration-200 hover:bg-gray-800/70"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
                      <FaList className="text-white" />
                    </div>
                    <FaCog className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Moderate Requests</h3>
                  <p className="text-gray-400 text-sm mb-3">Review and approve song requests</p>
                  <div className="flex items-center gap-2 text-red-400 text-xs font-medium">
                    <span>Manage Queue</span>
                    <FaList className="text-xs" />
                  </div>
                </a>

                {/* User Management */}
                <a
                  href="/admin/users"
                  className="group block bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 rounded-xl p-6 transition-all duration-200 hover:bg-gray-800/70"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                      <FaUsers className="text-white" />
                    </div>
                    <FaCog className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">User Management</h3>
                  <p className="text-gray-400 text-sm mb-3">Manage user roles and permissions</p>
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-medium">
                    <span>Admin Panel</span>
                    <FaUsers className="text-xs" />
                  </div>
                </a>

                {/* Theme Editor */}
                <a
                  href="/admin/themes"
                  className="group block bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 rounded-xl p-6 transition-all duration-200 hover:bg-gray-800/70"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                      <FaPalette className="text-white" />
                    </div>
                    <FaCog className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Theme Editor</h3>
                  <p className="text-gray-400 text-sm mb-3">Customize Spotify overlay themes</p>
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-medium">
                    <span>Customize</span>
                    <FaPalette className="text-xs" />
                  </div>
                </a>
              </>
            )}

            {/* Coming Soon Cards */}
            <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
                  <FaTwitch className="text-gray-300" />
                </div>
                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded-full">Coming Soon</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Twitch Integration</h3>
              <p className="text-gray-500 text-sm mb-3">Advanced Twitch API features</p>
              <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                <span>In Development</span>
                <FaTwitch className="text-xs" />
              </div>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
                  <FaCalendarAlt className="text-gray-300" />
                </div>
                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded-full">Coming Soon</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Event Manager</h3>
              <p className="text-gray-500 text-sm mb-3">Schedule and manage stream events</p>
              <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                <span>In Development</span>
                <FaCalendarAlt className="text-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              Made with <FaHeart className="inline text-red-400 mx-1" /> by Lawson
            </p>
            <a
              href="/api/discord/logout"
              className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all text-sm"
            >
              <FaDiscord className="text-xs" />
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
