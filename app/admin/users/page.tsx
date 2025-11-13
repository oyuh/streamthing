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
  avatar: string | null;
  isModerator: boolean;
  isStreamer: boolean;
  isBanned: boolean;
};

type BanLog = {
  id: string;
  userId: string;
  username: string;
  action: string;
  reason: string | null;
  moderatorId: string;
  moderatorUsername: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [banLogs, setBanLogs] = useState<BanLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [logSearch, setLogSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showDeleteLogModal, setShowDeleteLogModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [banTarget, setBanTarget] = useState<{ id: string; username: string; isBanned: boolean } | null>(null);
  const [deleteLogTarget, setDeleteLogTarget] = useState<{ id: string; username: string } | null>(null);
  const [unbanTarget, setUnbanTarget] = useState<{ userId: string; username: string } | null>(null);
  const [banReason, setBanReason] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  const fetchBanLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch('/api/ban-logs');
      if (res.ok) {
        const data = await res.json();
        setBanLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch ban logs', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      }
    } catch (err) {
      console.error('Failed to fetch current user', err);
    }
  };

  const deleteLog = async () => {
    if (!deleteLogTarget) return;
    
    try {
      const res = await fetch('/api/ban-logs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteLogTarget.id }),
      });
      if (res.ok) {
        await fetchBanLogs();
        setShowDeleteLogModal(false);
        setDeleteLogTarget(null);
      } else {
        alert('Failed to delete log');
      }
    } catch (error) {
      console.error('Failed to delete log', error);
      alert('Failed to delete log');
    }
  };

  const quickUnban = async () => {
    if (!unbanTarget) return;

    try {
      const res = await fetch(`/api/users/${unbanTarget.userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBanned: false, reason: 'Quick unban from logs' }),
      });

      if (res.ok) {
        await fetchUsers();
        await fetchBanLogs();
        setShowUnbanModal(false);
        setUnbanTarget(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to unban user');
      }
    } catch (err) {
      console.error('Failed to unban user', err);
      alert('Failed to unban user');
    }
  };

  useEffect(() => {
    void fetchUsers();
    void fetchBanLogs();
    void fetchCurrentUser();
  }, []);

  const updateRole = async (id: string, updates: Partial<Pick<User, 'isModerator' | 'isBanned'>>, reason?: string) => {
    setError('');
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, reason }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update user.');
        return;
      }

      await fetchUsers();
      await fetchBanLogs();
    } catch (err) {
      console.error('Failed to update role', err);
      setError('Server error while updating the user.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
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

  const filteredBanLogs = useMemo(() => {
    const query = logSearch.trim().toLowerCase();
    if (!query) return banLogs;

    return banLogs.filter((log) => {
      return (
        log.username.toLowerCase().includes(query) ||
        log.userId.toLowerCase().includes(query) ||
        log.moderatorUsername.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        (log.reason && log.reason.toLowerCase().includes(query))
      );
    });
  }, [banLogs, logSearch]);

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
          onClick={() => {
            void fetchUsers();
            void fetchBanLogs();
          }}
          disabled={loading || logsLoading}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:opacity-50"
        >
          <FaSync className={`text-xs ${loading || logsLoading ? 'animate-spin' : ''}`} />
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
                      <img
                        src={
                          user.avatar
                            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                            : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 5}.png`
                        }
                        alt=""
                        className="h-7 w-7 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = `https://cdn.discordapp.com/embed/avatars/0.png`;
                        }}
                      />
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
                          onClick={() => {
                            setBanTarget({ id: user.id, username: user.username || user.id, isBanned: user.isBanned });
                            setBanReason('');
                            setShowBanModal(true);
                          }}
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

      {/* Ban Logs Section */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Ban History</h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500" />
            <input
              type="text"
              placeholder="Search ban logs..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="h-9 w-64 rounded-lg border border-zinc-800 bg-zinc-900/50 pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-700 focus:outline-none"
            />
          </div>
        </div>
        {filteredBanLogs.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <p className="text-sm text-zinc-500">
              {logSearch ? 'No logs match your search' : 'No ban history yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBanLogs.map((log) => {
              const userStillBanned = users.find(u => u.id === log.userId)?.isBanned;
              return (
                <div
                  key={log.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                          log.action === 'banned'
                            ? 'bg-red-600/20 text-red-400 border-red-600/30'
                            : 'bg-green-600/20 text-green-400 border-green-600/30'
                        }`}>
                          {log.action.toUpperCase()}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {formatDate(log.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-white mb-1">
                        {log.username}
                      </p>
                      {log.reason && (
                        <p className="text-xs text-zinc-400 mb-2 italic">
                          "{log.reason}"
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-zinc-400">
                        <span>
                          User ID: <span className="text-white font-mono">{log.userId}</span>
                        </span>
                        <span>•</span>
                        <span>
                          Moderator: <span className="text-white">{log.moderatorUsername}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {log.action === 'banned' && userStillBanned && (
                        <button
                          type="button"
                          onClick={() => {
                            setUnbanTarget({ userId: log.userId, username: log.username });
                            setShowUnbanModal(true);
                          }}
                          className="rounded border border-green-900 bg-green-950/30 px-3 py-1.5 text-xs text-green-400 transition hover:border-green-700 whitespace-nowrap"
                        >
                          Unban
                        </button>
                      )}
                      {currentUser?.isStreamer && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteLogTarget({ id: log.id, username: log.username });
                            setShowDeleteLogModal(true);
                          }}
                          className="rounded border border-red-900 bg-red-950/30 px-3 py-1.5 text-xs text-red-400 transition hover:border-red-700 whitespace-nowrap"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ban/Unban Modal */}
      {showBanModal && banTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              {banTarget.isBanned ? 'Unban User' : 'Ban User'}
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              {banTarget.isBanned ? 'Unban' : 'Ban'} <span className="text-white font-medium">{banTarget.username}</span>?
            </p>
            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder={banTarget.isBanned ? "Enter unban reason..." : "Enter ban reason..."}
                rows={3}
                className="w-full rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowBanModal(false);
                  setBanTarget(null);
                  setBanReason('');
                }}
                className="flex-1 rounded border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  void updateRole(banTarget.id, { isBanned: !banTarget.isBanned }, banReason || undefined);
                  setShowBanModal(false);
                  setBanTarget(null);
                  setBanReason('');
                }}
                className={`flex-1 rounded border px-4 py-2 text-sm transition ${
                  banTarget.isBanned
                    ? 'border-green-900 bg-green-950/30 text-green-400 hover:border-green-700'
                    : 'border-red-900 bg-red-950/30 text-red-400 hover:border-red-700'
                }`}
              >
                {banTarget.isBanned ? 'Unban User' : 'Ban User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Log Confirmation Modal */}
      {showDeleteLogModal && deleteLogTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Log Entry</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Delete this log entry for <span className="text-white font-medium">{deleteLogTarget.username}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteLogModal(false);
                  setDeleteLogTarget(null);
                }}
                className="flex-1 rounded border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void deleteLog()}
                className="flex-1 rounded border border-red-900 bg-red-950/30 px-4 py-2 text-sm text-red-400 transition hover:border-red-700"
              >
                Delete Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Unban Confirmation Modal */}
      {showUnbanModal && unbanTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Unban User</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Unban <span className="text-white font-medium">{unbanTarget.username}</span>?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowUnbanModal(false);
                  setUnbanTarget(null);
                }}
                className="flex-1 rounded border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void quickUnban()}
                className="flex-1 rounded border border-green-900 bg-green-950/30 px-4 py-2 text-sm text-green-400 transition hover:border-green-700"
              >
                Unban User
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
