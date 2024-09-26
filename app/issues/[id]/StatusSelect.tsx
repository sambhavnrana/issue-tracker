"use client";

import { Issue, Issue_status } from '@prisma/client';
import axios from '@/app/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState } from 'react';

const statuses: { label: string; value: Issue_status }[] = [
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Closed', value: 'CLOSED' },
];

const StatusSelect = ({ issue }: { issue: Issue }) => {
    const router = useRouter();
    const [currentStatus, setCurrentStatus] = useState<Issue_status>(issue.status);
    const [isUpdating, setIsUpdating] = useState(false);

    const changeStatus = async (status: Issue_status) => {
        if (status === currentStatus) return; 
        
        setIsUpdating(true);
        setCurrentStatus(status); 
        
        try {
            await axios.patch(`/api/issues/${issue.id}/status`, { status });
            toast.success('Status updated successfully');
            router.refresh();
        } catch (error) {
            console.log('error', error);
            setCurrentStatus(issue.status);
            toast.error('Changes could not be saved');
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <select
            value={currentStatus}
            onChange={(e) => changeStatus(e.target.value as Issue_status)}
            disabled={isUpdating}
            className={`w-full border border-brand-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white ${
                isUpdating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
            {statuses.map(status => (
                <option key={status.value} value={status.value}>
                    {status.label}
                </option>
            ))}
        </select>
    )
}

export default StatusSelect