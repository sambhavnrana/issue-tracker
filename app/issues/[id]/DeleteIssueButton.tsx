"use client";

import Spinner from "@/app/components/Spinner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axiosInstance from '@/app/lib/axios';

const DeleteIssueButton = ({ issueId }: { issueId: number }) => {
    const router = useRouter();
    const [error, setError] = useState<string | false>(false);
    const [isDeleting, setDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const deleteIssue = async () => {
        try {
            setDeleting(true);
            await axiosInstance.delete('/api/issues/' + issueId);
            router.push('/issues/list');
            router.refresh();
        } catch (error: any) {
            setDeleting(false);
            setError(error?.response?.data?.error || 'An unexpected error occurred.');
        }
    }

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isDeleting ? <Spinner /> : 'Delete Issue'}
            </button>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this issue? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirm(false);
                                    deleteIssue();
                                }}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                            >
                                Delete Issue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {error && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
                        <p className="text-gray-600 mb-6">
                            {typeof error === 'string' ? error : 'This issue could not be completed.'}
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setError(false)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DeleteIssueButton