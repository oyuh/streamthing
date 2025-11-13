'use client';

import PageLayout from '@/components/dashboard/PageLayout';
import { useEffect, useMemo, useState } from 'react';
import {
  FaUsers,
  FaSearch,
  FaUserShield,
  FaBan,
  FaCrown,
  FaSync,
} from 'react-icons/fa';

type User = {
  id: string;
  username: string;
  isModerator: boolean;
  isStreamer: boolean;
  isBanned: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError('Unable to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const updateRole = async (id: string, updates: Partial<Pick<User, 'isModerator' | 'isBanned'>>) => {
    setError('');
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update user.');
        return;
      }

      await fetchUsers();
    } catch (err) {
      console.error('Failed to update role', err);
      setError('Server error while updating the user.');
    }
  };

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => {
      return (
        (user.username ?? '').toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      );
    });
  }, [users, searchTerm]);

  const stats = useMemo(() => ({
    total: users.length,
    streamers: users.filter((u) => u.isStreamer).length,
    moderators: users.filter((u) => u.isModerator).length,
    banned: users.filter((u) => u.isBanned).length,
  }), [users]);

  return (
    <PageLayout
      title="Users"
      icon={FaUsers}
      description="Manage roles"
      actions={
        <button
          type="button"
          onClick={() => void fetchUsers()}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:opacity-50"
        >
          <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      {/* Search */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
        <div className="relative">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by username or ID..."
            className="w-full rounded border border-zinc-800 bg-black pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <FaUsers className="text-[10px]" />
            <span>Total</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <FaCrown className="text-[10px]" />
            <span>Streamers</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{stats.streamers}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <FaUserShield className="text-[10px]" />
            <span>Moderators</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{stats.moderators}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <FaBan className="text-[10px]" />
            <span>Banned</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{stats.banned}</p>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="mt-6 rounded-lg border border-red-900 bg-red-950/30 p-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      {/* Users table */}
      <div className="mt-6 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/30">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-center font-medium">Role</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-zinc-800 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-white">
                        {(user.username || 'U')[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white">{user.username || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{user.id}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs ${
                        user.isStreamer
                          ? 'border-yellow-900 bg-yellow-950/30 text-yellow-400'
                          : user.isModerator
                          ? 'border-green-900 bg-green-950/30 text-green-400'
                          : 'border-zinc-800 bg-black text-zinc-500'
                      }`}
                    >
                      {user.isStreamer ? (
                        <>
                          <FaCrown className="text-[9px]" /> Streamer
                        </>
                      ) : user.isModerator ? (
                        <>
                          <FaUserShield className="text-[9px]" /> Moderator
                        </>
                      ) : (
                        'Viewer'
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs ${
                        user.isBanned
                          ? 'border-red-900 bg-red-950/30 text-red-400'
                          : 'border-green-900 bg-green-950/30 text-green-400'
                      }`}
                    >
                      {user.isBanned ? (
                        <>
                          <FaBan className="text-[9px]" /> Banned
                        </>
                      ) : (
                        'Active'
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.isStreamer ? (
                      <div className="text-center text-xs text-zinc-600">Protected</div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => void updateRole(user.id, { isModerator: !user.isModerator })}
                          className={`rounded border px-2 py-1 text-xs transition ${
                            user.isModerator
                              ? 'border-orange-900 bg-orange-950/30 text-orange-400 hover:border-orange-700'
                              : 'border-green-900 bg-green-950/30 text-green-400 hover:border-green-700'
                          }`}
                        >
                          {user.isModerator ? 'Demote' : 'Promote'}
                        </button>
                        <button
                          type="button"
                          onClick={() => void updateRole(user.id, { isBanned: !user.isBanned })}
                          className={`rounded border px-2 py-1 text-xs transition ${
                            user.isBanned
                              ? 'border-green-900 bg-green-950/30 text-green-400 hover:border-green-700'
                              : 'border-red-900 bg-red-950/30 text-red-400 hover:border-red-700'
                          }`}
                        >
                          {user.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              No users found
            </div>
          ) : null}
        </div>
      </div>
    </PageLayout>
  );
}
