"use client";

import { Issue, Status } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import axios from '@/app/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const statuses: { label: string; value: Status }[] = [
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Closed', value: 'CLOSED' },
];

const StatusSelect = ({ issue }: { issue: Issue }) => {
    const router = useRouter();

    const changeStatus = async (status: Status) => {
        try {
            await axios.patch(`/api/issues/${issue.id}/status`, { status });
            router.refresh();
            toast.success('Status updated successfully');
        } catch (error) {
            toast.error('Changes could not be saved');
        }
    };

    return (
        <Select.Root
            defaultValue={issue.status}
            onValueChange={(value) => changeStatus(value as Status)}>
            <Select.Trigger />
            <Select.Content>
                {statuses.map((status) => (
                    <Select.Item key={status.value} value={status.value}>
                        {status.label}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
};

export default StatusSelect; 