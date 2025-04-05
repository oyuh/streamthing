'use client';

import { useEffect, useState } from 'react';

type User = {
  id: string;
  username: string;
  isModerator: boolean;
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
    <div className="min-h-screen bg-gradient-to-br from-black to-zinc-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">👑 Admin Users Panel</h1>

        <input
          className="w-full mb-4 p-2 rounded-lg bg-zinc-800 text-white"
          placeholder="Search by username or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {error && <div className="bg-red-600 p-2 rounded mb-4">{error}</div>}

        <table className="w-full table-auto bg-zinc-800 rounded-lg">
          <thead>
            <tr>
              <th className="p-2">Username</th>
              <th className="p-2">Discord ID</th>
              <th className="p-2">Moderator</th>
              <th className="p-2">Banned</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t border-zinc-700">
                <td className="p-3">{user.username || 'Unknown'}</td>
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.isModerator ? '✅' : '❌'}</td>
                <td className="p-3">{user.isBanned ? '🚫' : '✔️'}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => updateRole(user.id, { isModerator: !user.isModerator })}
                    className={`px-4 py-1 rounded ${
                      user.isModerator ? 'bg-orange-600' : 'bg-green-600'
                    }`}
                  >
                    {user.isModerator ? 'Demote' : 'Promote'}
                  </button>
                  <button
                    onClick={() => updateRole(user.id, { isBanned: !user.isBanned })}
                    className={`px-4 py-1 rounded ${
                      user.isBanned ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {user.isBanned ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
