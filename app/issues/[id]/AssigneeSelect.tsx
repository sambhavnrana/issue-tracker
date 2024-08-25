"use client";

import { User } from '@prisma/client';
import { Select } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Skeleton } from '@/app/components';


const AssigneeSelect = () => {
    const { data: users, error, isLoading } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => axios.get('/api/users').then(res => res.data),
        staleTime: 1000 * 60, // 60 secs tak refresh nahi karega
        retry: 3, // ie 3 baar try karega
    });

    if (isLoading) return <Skeleton />;

    if (error) return null;

    return (
        <Select.Root defaultValue="orange">
            <Select.Trigger value="asd" >
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    <Select.Label>Suggestions</Select.Label>
                    {users?.map(user => (
                        <Select.Item key={user.id} value={user.id}>{user.name}</Select.Item>
                    ))}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    )
}

export default AssigneeSelect