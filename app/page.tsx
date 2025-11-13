'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  FaDiscord,
  FaList,
  FaMusic,
  FaPalette,
  FaSpotify,
  FaUsers,
} from 'react-icons/fa';
import LandingPage from '@/app/components/LandingPage';

type DiscordUser = {
  id: string;
  username: string;
  avatar?: string | null;
  isModerator?: boolean;
  isStreamer?: boolean;
};

export default function Home() {
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          if (data?.username) {
            setDiscordUser(data);
            
            // Fetch current track if user is moderator
            if (data.isModerator || data.isStreamer) {
              try {
                const trackRes = await fetch('/api/spotify/track');
                if (trackRes.ok) {
                  const trackData = await trackRes.json();
                  if (trackData?.track) {
                    setCurrentTrack(trackData);
                  }
                }
              } catch (err) {
                console.warn('Unable to load track', err);
              }
            }
          }
        }
      } catch (error) {
        console.warn('Unable to load user', error);
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, []);

  // Poll for track updates every second if user is moderator
  useEffect(() => {
    if (!discordUser?.isModerator && !discordUser?.isStreamer) return;

    const pollTrack = setInterval(async () => {
      try {
        const trackRes = await fetch('/api/spotify/track');
        if (trackRes.ok) {
          const trackData = await trackRes.json();
          if (trackData?.track) {
            setCurrentTrack(trackData);
          }
        }
      } catch (err) {
        console.warn('Unable to poll track', err);
      }
    }, 1000);

    return () => clearInterval(pollTrack);
  }, [discordUser]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
          Loading...
        </div>
      </div>
    );
  }

  if (!discordUser) {
    return <LandingPage />;
  }

  const isMod = discordUser.isModerator || discordUser.isStreamer;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center justify-between border-b border-zinc-800/50 pb-6">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-zinc-900">
              {discordUser.avatar ? (
                <img
                  src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`}
                  alt={discordUser.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-600">
                  <FaDiscord />
                </div>
              )}
            </div>
          <div>
            <p className="text-sm font-medium">{discordUser.username}</p>
            <p className="text-xs text-zinc-500">
              {discordUser.isStreamer ? 'Streamer' : isMod ? 'Moderator' : 'User'}
            </p>
          </div>
        </div>
        <button
          onClick={async () => {
            await fetch('/api/discord/logout');
            window.location.href = '/';
          }}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-white"
        >
          Sign out
        </button>
      </div>        <div className="space-y-6">
          <div>
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Quick actions
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/request-song"
                className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                  <FaMusic className="text-sm text-white/60" />
                </div>
                <div>
                  <p className="text-sm font-medium">Request song</p>
                  <p className="text-xs text-zinc-500">Add to queue</p>
                </div>
              </Link>

              {isMod && (
                <Link
                  href="/spotify"
                  className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                    <FaSpotify className="text-sm text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {currentTrack?.track ? (
                      <>
                        <p className="text-sm font-medium truncate">{currentTrack.track}</p>
                        <p className="text-xs text-zinc-500 truncate">
                          {currentTrack.artist} · {currentTrack.progress ? `${Math.floor(currentTrack.progress / 60000)}:${String(Math.floor((currentTrack.progress % 60000) / 1000)).padStart(2, '0')} / ${Math.floor(currentTrack.duration / 60000)}:${String(Math.floor((currentTrack.duration % 60000) / 1000)).padStart(2, '0')}` : 'Loading...'}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium">Go to Spotify Widget</p>
                        <p className="text-xs text-zinc-500">View overlay</p>
                      </>
                    )}
                  </div>
                </Link>
              )}
            </div>
          </div>

          {isMod && (
            <div>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Management
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/requests"
                  className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                    <FaList className="text-sm text-white/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Song requests</p>
                    <p className="text-xs text-zinc-500">Moderate queue</p>
                  </div>
                </Link>

                <Link
                  href="/admin/users"
                  className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                    <FaUsers className="text-sm text-white/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Users</p>
                    <p className="text-xs text-zinc-500">Manage roles</p>
                  </div>
                </Link>

                <Link
                  href="/admin/themes"
                  className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                    <FaPalette className="text-sm text-white/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Themes</p>
                    <p className="text-xs text-zinc-500">Customize overlay</p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
