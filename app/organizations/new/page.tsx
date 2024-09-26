'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateOrganizationPage() {
  const [name, setName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setError('Failed to load users'));
  }, []);

  useEffect(() => {
    if (!session || !session.user || typeof session.user.id !== 'string') return;
    setMembers([session.user.id]);
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, memberIds: members }),
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create organization');
      } else {
        setSuccess('Organization created!');
        setName('');
        setMembers([]);
        setTimeout(() => router.push('/organizations'), 1000);
      }
    } catch {
      setError('Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create New Organization</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Organization Name</label>
        <input
          className="w-full border px-3 py-2 rounded mb-4"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <label className="block mb-2 font-medium">Members</label>
        <div className="mb-4 grid gap-2">
          {Array.isArray(users) ? (
            users.map(user => (
              <label key={user.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={user.id}
                  checked={members.includes(user.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setMembers(prev => [...prev, user.id]);
                    } else {
                      setMembers(prev => prev.filter(id => id !== user.id));
                    }
                  }}
                  disabled={user.id === session?.user?.id}
                />
                <span>{user.name || user.email} {user.id === session?.user?.id && '(You)'}</span>
              </label>
            ))
          ) : (
            <div className="text-red-700 font-medium">Failed to load users.</div>
          )}
        </div>
        <button
          type="submit"
          className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-light"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Organization'}
        </button>
        {error && <div className="text-red-700 mt-2 font-medium">{error}</div>}
        {success && <div className="text-green-600 mt-2 font-medium">{success}</div>}
      </form>
    </div>
  );
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}; 