"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Spinner from '@/app/components/Spinner';

// Simple bar chart component
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex gap-4 mt-6">
      {data.map(d => (
        <div key={d.label} className="flex flex-col items-center">
          <div
            className="bgk w-8 rounded-t"
            style={{ height: `${(d.value / max) * 120}px` }}
            title={d.value.toString()}
          ></div>
          <div className="mt-2 text-sm font-medium">{d.label}</div>
          <div className="text-xs text-gray-600">{d.value}</div>
        </div>
      ))}
    </div>
  );
}

export default function OrganizationDashboardPage() {
  const params = useParams();
  const orgId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [org, setOrg] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/organizations/${orgId}`).then(res => res.json()),
      fetch(`/api/organizations/${orgId}/issues`).then(res => res.json()),
    ])
      .then(([orgData, issuesData]) => {
        setOrg(orgData);
        setIssues(issuesData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load dashboard');
        setLoading(false);
      });
  }, [orgId]);

  if (loading) return <Spinner />;
  if (error) return <div className="p-8 text-center text-red-700 font-medium">{error}</div>;
  if (!org) return <div className="p-8 text-center text-gray-600">Organization not found.</div>;

  const statusCounts = [
    { label: 'Open', value: issues.filter(i => i.status === 'OPEN').length },
    { label: 'In Progress', value: issues.filter(i => i.status === 'IN_PROGRESS').length },
    { label: 'Closed', value: issues.filter(i => i.status === 'CLOSED').length },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex gap-4 mb-6">
        <a href={`/organizations/${orgId}/projects/new`} className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700">+ New Project</a>
      </div>
      <h1 className="text-2xl font-bold mb-2">{org.name}</h1>
      <div className="mb-4 text-gray-700">Members: {(org.organizationMemberships ?? []).map((m: any) => m.user.name || m.user.email).join(', ')}</div>
      <h2 className="text-lg font-semibold mt-6 mb-2">Issue Status Overview</h2>
      <BarChart data={statusCounts} />
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Recent Issues</h3>
        <ul className="divide-y">
          {issues.slice(0, 5).map(issue => (
            <li key={issue.id} className="py-2">
              <span className="font-medium">{issue.title}</span> <span className="text-xs text-gray-500">[{issue.status}]</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 