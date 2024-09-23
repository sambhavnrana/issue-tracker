"use client";

import { Issue, Issue_status } from '@prisma/client';
import axios from '@/app/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const statuses: { label: string; value: Issue_status }[] = [
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Closed', value: 'CLOSED' },
];

const StatusSelect = ({ issue }: { issue: Issue }) => {
    const router = useRouter();

    const changeStatus = async (status: Issue_status) => {
        try {
            await axios.patch(`/api/issues/${issue.id}/status`, { status });
            router.refresh();
            toast.success('Status updated successfully');
        } catch (error) {
            console.log('error', error);
            toast.error('Changes could not be saved');
        }
    }

    return (
        <select
            value={issue.status}
            onChange={(e) => changeStatus(e.target.value as Issue_status)}
            className="w-full border border-brand-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white"
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