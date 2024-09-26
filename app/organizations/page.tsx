"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@radix-ui/themes';
import * as Tooltip from '@radix-ui/react-tooltip';
import Spinner from '../components/Spinner';

export default function CreatedOrganizationsPage() {
  const [myOrganizations, setMyOrganizations] = useState<any[]>([]);
  const [assignedOrganizations, setAssignedOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/organizations').then(res => res.json()),
      fetch('/api/organizations/assigned').then(res => res.json()),
    ])
      .then(([myOrgs, assignedOrgs]) => {
        setMyOrganizations(myOrgs);
        setAssignedOrganizations(assignedOrgs);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load organizations');
        setLoading(false);
      });
  }, []);

  const startEdit = (org: any) => {
    setEditingId(org.id);
    setEditName(org.name);
    setEditError('');
    setEditSuccess('');
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditError('');
    setEditSuccess('');
  };
  const saveEdit = async (id: string) => {
    setEditError('');
    setEditSuccess('');
    try {
      const res = await fetch(`/api/organizations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      if (!res.ok) {
        const data = await res.json();
        setEditError(data.error || 'Failed to update name');
      } else {
        setEditSuccess('Name updated!');
        setMyOrganizations(orgs => orgs.map(o => o.id === id ? { ...o, name: editName } : o));
        setTimeout(cancelEdit, 1000);
      }
    } catch {
      setEditError('Failed to update name');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="p-8 text-center text-red-700 font-medium">{error}</div>;

  return (
    <div className="max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* New Organization Button */}
        <div className="mb-8 flex justify-center">
          <Link
            href="/organizations/new"
            className="inline-flex items-center bg-gradient-to-r from-brand to-brand-dark text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold hover:from-brand-dark hover:to-brand transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark hover:shadow-2xl hover:scale-110"
          > 
            + New Organization
          </Link>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* My Organizations */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-brand-dark to-brand">
              <h2 className="text-xl font-bold text-white">My Organizations</h2>
            </div>
            <div className="p-6">
              {Array.isArray(myOrganizations) && myOrganizations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">No organizations created yet.</p>
                  <Link
                    href="/organizations/new"
                    className="inline-flex items-center bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
                  >
                    Create your first organization
                  </Link>
                </div>
              ) : Array.isArray(myOrganizations) ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Created</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {myOrganizations.map((org) => (
                        <tr key={org.id} className="hover:bg-pink-50 transition-colors">
                          <td className="px-4 py-3">
                            <Link href={`/organizations/${org.id}`} className="text-blue-700 hover:text-brand hover:underline font-medium">
                              {org.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(org.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <Link 
                                href={`/organizations/${org.id}/edit`} 
                                className="inline-flex items-center px-3 py-1 bg-white text-brand text-sm rounded-lg border hover:scale-105 border-brand-light hover:bg-gray-100 hover:border-brand-dark hover:text-brand-dark"
                              >
                                Edit
                              </Link>
                              <Link 
                                href={`/organizations/${org.id}/projects/new`} 
                                className="inline-flex items-center px-3 py-1 bg-brand-light text-white text-sm rounded-lg hover:scale-105 hover:bg-brand transition-colors"
                              >
                                + Project
                              </Link>
                              <Link 
                                href={`/issues/new?organizationId=${org.id}`} 
                                className="inline-flex items-center px-3 py-1 bg-brand text-white text-sm rounded-lg hover:scale-105 hover:bg-brand-dark transition-colors"
                              >
                                + Issue
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-red-700 font-medium text-center py-4">Failed to load organizations.</div>
              )}
            </div>
          </div>

          {/* Assigned Organizations */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-brand to-brand-dark">
              <h2 className="text-xl font-bold text-white">Assigned Organizations</h2>
            </div>
            <div className="p-6">
              {Array.isArray(assignedOrganizations) && assignedOrganizations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">No assigned organizations yet.</p>
                </div>
              ) : Array.isArray(assignedOrganizations) ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Creator</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Created</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assignedOrganizations.map((org) => (
                        <tr key={org.id} className="hover:bg-pink-50 transition-colors">
                          <td className="px-4 py-3">
                            <Link href={`/organizations/${org.id}`} className="text-blue-700 hover:text-brand hover:underline font-medium">
                              {org.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            {org.creator && (
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <Avatar 
                                    src={org.creator.image} 
                                    fallback={org.creator.name?.[0] || '?'} 
                                    radius="full" 
                                    size="3" 
                                  />
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content side="top" align="center" className="bg-brand text-white px-2 py-1 rounded shadow">
                                    {org.creator.name || org.creator.email || 'Unknown'}
                                    <Tooltip.Arrow className="fill-brand" />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(org.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <Link 
                                href={`/organizations/${org.id}/projects/new`} 
                                className="inline-flex items-center px-3 py-1 bg-brand-light text-white text-sm rounded-lg hover:bg-brand transition-colors"
                              >
                                + Project
                              </Link>
                              <Link 
                                href={`/issues/new?organizationId=${org.id}`} 
                                className="inline-flex items-center px-3 py-1 bg-brand text-white text-sm rounded-lg hover:bg-brand-dark transition-colors"
                              >
                                + Issue
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-red-700 font-medium text-center py-4">Failed to load assigned organizations.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}; 