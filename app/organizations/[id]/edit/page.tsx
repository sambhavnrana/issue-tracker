"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/app/components/Spinner";
import { Trash2, AlertTriangle } from "lucide-react";

export default function EditOrganizationPage() {
  const params = useParams();
  const orgId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [org, setOrg] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/organizations/${orgId}`).then(res => res.json()),
      fetch("/api/users").then(res => res.json()),
    ])
      .then(([orgData, usersData]) => {
        setOrg(orgData);
        setUsers(usersData);
        setSelectedMembers((orgData.organizationMemberships ?? []).map((m: any) => m.userId));
        setName(orgData.name || "");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, [orgId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/organizations/${orgId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberIds: selectedMembers, name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update organization");
      } else {
        setSuccess("Organization updated!");
        setTimeout(() => router.push("/organizations"), 1000);
      }
    } catch {
      setError("Failed to update organization");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/organizations/${orgId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete organization");
      } else {
        setSuccess("Organization deleted successfully!");
        setTimeout(() => router.push("/organizations"), 1000);
      }
    } catch {
      setError("Failed to delete organization");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="p-8 text-center text-red-700 font-medium">{error}</div>;
  if (!org) return <div className="p-8 text-center text-gray-600">Organization not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-brand to-brand-dark">
            <h1 className="text-2xl font-bold text-white">Edit Organization</h1>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Organization Name</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Members</label>
                <div className="grid gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {users.map(user => (
                    <label key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        value={user.id}
                        checked={selectedMembers.includes(user.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedMembers(prev => [...prev, user.id]);
                          } else {
                            setSelectedMembers(prev => prev.filter(id => id !== user.id));
                          }
                        }}
                        disabled={user.id === org.creatorId}
                        className="rounded border-gray-300 text-brand focus:ring-brand"
                      />
                      <span className="text-sm">
                        {user.name || user.email} 
                        {user.id === org.creatorId && (
                          <span className="ml-2 text-xs bg-brand-light text-white px-2 py-1 rounded">Creator</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-brand to-brand-dark text-white px-6 py-3 rounded-lg hover:from-brand-dark hover:to-brand transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2"
                  disabled={loading}
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
              
              {error && <div className="text-red-700 mt-4 font-medium">{error}</div>}
              {success && <div className="text-green-600 mt-4 font-medium">{success}</div>}
            </form>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Organization</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                Are you sure you want to delete <strong>{`&quot;${org.name}&quot;`}</strong>?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">
                    <strong>Warning:</strong> This will permanently delete:
                  </p>
                  <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
                    <li>All projects in this organization</li>
                    <li>All issues in this organization</li>
                    <li>All member associations</li>
                    <li>The organization itself</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete Organization"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 