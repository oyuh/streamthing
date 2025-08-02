'use client';

import { useEffect, useState } from 'react';
import { FaUsers, FaSearch, FaUserShield, FaBan, FaHome, FaCrown } from 'react-icons/fa';

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

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id: string, updates: Partial<Pick<User, 'isModerator' | 'isBanned'>>) => {
    setError('');
    const res = await fetch(`/api/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      fetchUsers();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to update user');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-slate-900 to-black text-white">
      {/* Header */}
      <header className="bg-zinc-900/50 border-b border-zinc-700 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FaUsers className="text-purple-400 text-2xl" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
                User Management
              </h1>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition"
            >
              <FaHome />
              Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search users by username or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <FaUsers className="text-blue-400 text-xl" />
              <div>
                <h3 className="text-sm text-zinc-400">Total Users</h3>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <FaCrown className="text-yellow-400 text-xl" />
              <div>
                <h3 className="text-sm text-zinc-400">Streamers</h3>
                <p className="text-2xl font-bold">{users.filter(u => u.isStreamer).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <FaUserShield className="text-green-400 text-xl" />
              <div>
                <h3 className="text-sm text-zinc-400">Moderators</h3>
                <p className="text-2xl font-bold">{users.filter(u => u.isModerator).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <FaBan className="text-red-400 text-xl" />
              <div>
                <h3 className="text-sm text-zinc-400">Banned Users</h3>
                <p className="text-2xl font-bold">{users.filter(u => u.isBanned).length}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Users Table */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-700">
            <h2 className="text-xl font-semibold">All Users</h2>
            <p className="text-zinc-400 text-sm mt-1">Manage user roles and permissions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900/50">
                <tr>
                  <th className="text-left px-6 py-4 font-medium text-zinc-300">Username</th>
                  <th className="text-left px-6 py-4 font-medium text-zinc-300">Discord ID</th>
                  <th className="text-center px-6 py-4 font-medium text-zinc-300">Role</th>
                  <th className="text-center px-6 py-4 font-medium text-zinc-300">Status</th>
                  <th className="text-center px-6 py-4 font-medium text-zinc-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-zinc-700 hover:bg-zinc-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                          {(user.username || 'U')[0].toUpperCase()}
                        </div>
                        <span className="font-medium">{user.username || 'Unknown User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 font-mono text-sm">{user.id}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.isStreamer
                          ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                          : user.isModerator
                          ? 'bg-green-900/50 text-green-400 border border-green-700'
                          : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700'
                      }`}>
                        {user.isStreamer ? (
                          <><FaCrown className="w-3 h-3" /> Streamer</>
                        ) : user.isModerator ? (
                          <><FaUserShield className="w-3 h-3" /> Moderator</>
                        ) : (
                          'User'
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.isBanned
                          ? 'bg-red-900/50 text-red-400 border border-red-700'
                          : 'bg-green-900/50 text-green-400 border border-green-700'
                      }`}>
                        {user.isBanned ? <><FaBan className="w-3 h-3" /> Banned</> : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {user.isStreamer ? (
                          <div className="text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-lg border border-zinc-700">
                            Protected Account
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => updateRole(user.id, { isModerator: !user.isModerator })}
                              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition ${
                                user.isModerator
                                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              <FaUserShield className="w-3 h-3" />
                              {user.isModerator ? 'Demote' : 'Promote'}
                            </button>
                            <button
                              onClick={() => updateRole(user.id, { isBanned: !user.isBanned })}
                              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition ${
                                user.isBanned
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-red-600 hover:bg-red-700 text-white'
                              }`}
                            >
                              <FaBan className="w-3 h-3" />
                              {user.isBanned ? 'Unban' : 'Ban'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-zinc-400">
                <p>No users found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
