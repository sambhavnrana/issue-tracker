"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/organizations/${orgId}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create project');
      } else {
        setSuccess('Project created!');
        setTimeout(() => router.push('/issues/new'), 1000);
      }
    } catch {
      setError('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Project Name</label>
        <input
          className="w-full border px-3 py-2 rounded mb-4"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          className="w-full border px-3 py-2 rounded mb-4"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
        {error && <div className="text-red-700 mt-2 font-medium">{error}</div>}
        {success && <div className="text-green-600 mt-2 font-medium">{success}</div>}
      </form>
    </div>
  );
} 