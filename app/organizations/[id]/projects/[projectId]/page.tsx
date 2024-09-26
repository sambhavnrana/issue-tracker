"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, Heading, Text } from "@radix-ui/themes";
import { IssueStatusBadge } from "@/app/components";
import Link from "next/link";
import { Avatar } from "@radix-ui/themes";
import * as Tooltip from '@radix-ui/react-tooltip';
import { Edit2, Save, X, Loader2 } from "lucide-react";
import Spinner from "@/app/components/Spinner";

export default function ProjectOverviewPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  useEffect(() => {
    if (!params.id || !params.projectId) return;
    
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/organizations/${params.id}/projects/${params.projectId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch project');
        }
        const projectData = await res.json();
        setProject(projectData);
        setEditName(projectData.name || "");
        setEditDescription(projectData.description || "");
        setLoading(false);
      } catch (err) {
        setError('Failed to load project');
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id, params.projectId]);

  const handleSave = async () => {
    if (!params.id || !params.projectId) return;
    
    setSaving(true);
    setSaveError("");
    setSaveSuccess("");
    
    try {
      const res = await fetch(`/api/organizations/${params.id}/projects/${params.projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editName,
          description: editDescription 
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update project');
      }
      
      const updatedProject = await res.json();
      setProject(updatedProject);
      setSaveSuccess('Project updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSaveSuccess(""), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditName(project?.name || "");
    setEditDescription(project?.description || "");
    setIsEditing(false);
    setSaveError("");
  };

  if (loading) return <Spinner />;
  if (error) return <div className="p-8 text-center text-red-700 font-medium">{error}</div>;
  if (!project) return <div className="p-8 text-center text-gray-600">Project not found.</div>;

  const totalIssues = project.Issue?.length || 0;
  const openIssues = project.Issue?.filter((issue: any) => issue.status === 'OPEN').length || 0;
  const inProgressIssues = project.Issue?.filter((issue: any) => issue.status === 'IN_PROGRESS').length || 0;
  const closedIssues = project.Issue?.filter((issue: any) => issue.status === 'CLOSED').length || 0;

  const stats = [
    { label: 'Total Issues', value: totalIssues, color: 'text-brand-dark' },
    { label: 'Open', value: openIssues, color: 'text-red-600' },
    { label: 'In Progress', value: inProgressIssues, color: 'text-purple-600' },
    { label: 'Closed', value: closedIssues, color: 'text-green-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      {/* Project Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-3xl font-bold text-brand-dark bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent w-full"
                  placeholder="Project name"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent w-full resize-none"
                  placeholder="Project description (optional)"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving || !editName.trim()}
                    className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 min-w-[100px]"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
                {saveError && <div className="text-red-700 text-sm">{saveError}</div>}
                {saveSuccess && <div className="text-green-600 text-sm">{saveSuccess}</div>}
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-brand-dark">{project.name}</h1>
                <p className="text-brand mt-2 text-lg font-semibold">Project Name: <span className="text-brand-dark mt-2 font-normal text-base">{project.organization?.name}</span></p>
                <p>{project.description && (
                  <p className="text-brand-light mt-2 text-base font-semibold ">Project Description: <span className="text-gray-600 mt-2 font-normal text-base">{project.description}</span></p>
                )}</p>
                
              </div>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-brand-light text-white px-4 py-2 rounded-lg hover:bg-brand transition-colors"
              >
                <Edit2 size={16} />
                Edit
              </button>
            )}
            <Link 
              href={`/issues/new?organizationId=${project.organizationId}&projectId=${project.id}`}
              className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
            >
              + New Issue
            </Link>
          </div>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 text-center border border-brand-light">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Issues Table */}
      <Card className="shadow-xl border border-brand-light bg-white">
        <Heading size="5" mb="5" className="flex items-center gap-2 text-brand">
          Project Issues
          <span className="text-sm font-normal text-brand-light">
            - {totalIssues} total issues
          </span>
        </Heading>
        
        {totalIssues === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No issues created for this project yet.</p>
            <Link 
              href={`/issues/new?organizationId=${project.organizationId}&projectId=${project.id}`}
              className="text-brand hover:underline mt-2 inline-block"
            >
              Create the first issue
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-light overflow-hidden rounded-lg text-xs sm:text-sm">
              <thead className="bg-brand-light">
                <tr>
                  <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Title</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Creator</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-light">
                {project.Issue?.map((issue: any) => (
                  <tr key={issue.id} className="transition">
                    <td className="px-2 sm:px-3 md:px-4 py-2">
                      <Link 
                        href={`/issues/${issue.id}`} 
                        className="text-blue-700 hover:underline hover:text-brand-dark font-medium text-xs sm:text-sm"
                      >
                        {issue.title}
                      </Link>
                    </td>
                    <td className="px-2 sm:px-3 md:px-4 py-2">
                      <IssueStatusBadge status={issue.status} />
                    </td>
                    <td className="px-2 sm:px-3 md:px-4 py-2">
                      {issue.creator && (
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <Avatar
                              src={issue.creator.image!}
                              fallback={issue.creator.name?.[0] || '?'}
                              size="2"
                              className="sm:size-3"
                              radius='full'
                            />
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content 
                              side="top" 
                              align="center" 
                              className="bg-brand text-white px-2 py-1 rounded shadow text-xs"
                            >
                              {issue.creator.name || issue.creator.email || 'Unknown'}
                              <Tooltip.Arrow className="fill-brand" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      )}
                    </td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm text-gray-600">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
} 