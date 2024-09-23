"use client"

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Flex } from '@radix-ui/themes';
import AssigneeSelect from './AssigneeSelect';
import DeleteIssueButton from './DeleteIssueButton';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import StatusSelect from './StatusSelect';
import Spinner from '@/app/components/Spinner';

export default function IssueDetailClient() {
  const params = useParams();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authorized, setAuthorized] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);
    fetch(`/api/issues/${params.id}`)
      .then(async res => {
        if (res.status === 401 || res.status === 403) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        if (!res.ok) {
          setError('Failed to load issue');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setIssue(data);
        fetch('/api/auth/session').then(r => r.json()).then(session => {
          setIsOwner(session?.user?.id && data.organization?.creatorId === session.user.id);
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load issue');
        setLoading(false);
      });
  }, [params?.id]);

  if (loading) return <Spinner />;
  if (!authorized) return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4">
        <div className="text-2xl font-bold mb-2 text-brand-dark">Not Authorized</div>
        <div className="text-brand-light mb-6">You are not authorized to view or edit this issue.</div>
        <button 
          className="bg-brand text-white px-6 py-2 rounded hover:bg-brand-dark transition" 
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
  if (error) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="text-center text-red-700 font-medium bg-red-50 p-6 rounded-lg border border-red-200">
        {error}
      </div>
    </div>
  );
  if (!issue) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="text-center text-brand-light bg-gray-50 p-6 rounded-lg border border-gray-200">
        Issue not found.
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <IssueDetails issue={issue} ownerName={issue.organization?.creator?.name} creatorImage={issue.creator?.image} />
          {!isOwner && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-yellow-800 font-medium text-sm">
                Only the organization owner can edit or delete this issue.
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-brand-light rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-brand-dark mb-4">Issue Actions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <StatusSelect issue={issue} />
              </div>
              
              {isOwner && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <EditIssueButton issueId={issue.id} />
                  <DeleteIssueButton issueId={issue.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 