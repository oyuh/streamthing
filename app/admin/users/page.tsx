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
  const [discordUser, setDiscordUser] = useState<{ id: string; username: string } | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(async (user) => {
        if (!user?.id) return setUnauthorized(true);

        const res = await fetch(`/api/users/${user.id}/role`);
        const role = await res.json();

        if (!role?.isModerator) {
          setUnauthorized(true);
        } else {
          setDiscordUser(user);
          fetchUsers();
        }
      });
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users.');
    }
    setLoading(false);
  };

  const updateRole = async (id: string, action: 'mod' | 'ban' | 'unban') => {
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update user');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update user');
    }
  };

  if (unauthorized) {
    return <div className="text-center mt-20 text-red-500">❌ Unauthorized</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">👤 Admin User Panel</h1>

        {error && <div className="bg-red-600 p-4 rounded mb-4">{error}</div>}

        {loading ? (
          <p className="text-center text-zinc-400">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-zinc-700 rounded-xl overflow-hidden">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Discord ID</th>
                  <th className="p-3">Moderator</th>
                  <th className="p-3">Banned</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t border-zinc-700">
                    <td className="p-3">{user.username || 'Unknown'}</td>
                    <td className="p-3 text-zinc-400">{user.id}</td>
                    <td className="p-3 text-center">{user.isModerator ? '✅' : '❌'}</td>
                    <td className="p-3 text-center">{user.isBanned ? '❌' : '✅'}</td>
                    <td className="p-3 flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => updateRole(user.id, 'mod')}
                        className="bg-indigo-600 hover:bg-indigo-500 px-4 py-1 rounded"
                      >
                        Toggle Mod
                      </button>
                      <button
                        onClick={() => updateRole(user.id, user.isBanned ? 'unban' : 'ban')}
                        className="bg-red-600 hover:bg-red-500 px-4 py-1 rounded"
                      >
                        {user.isBanned ? 'Unban' : 'Ban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
