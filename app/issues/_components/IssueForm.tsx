"use client"

import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { issueSchema } from '@/app/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Issue } from '@prisma/client';
import { Button, Callout, TextField } from '@radix-ui/themes';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Controller, useForm } from "react-hook-form";
import { z } from 'zod';
import SimpleMDE from 'react-simplemde-editor';
import axiosInstance from '@/app/lib/axios';

type IssueFormData = z.infer<typeof issueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm<IssueFormData>({
        resolver: zodResolver(issueSchema),
        defaultValues: issue ? {
            organizationId: issue.organizationId || '',
            projectId: issue.projectId,
            title: issue.title,
            description: issue.description,
        } : {}
    });
    const [error, setError] = useState('')
    const [isSubmitting, setSubmitting] = useState(false)
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const selectedOrg = watch('organizationId');

    useEffect(() => {
        fetch('/api/organizations/all')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setOrganizations(data);
                } else {
                    setOrganizations([]);
                    setError(data?.error || 'Failed to load organizations');
                }
            })
            .catch(() => setError('Failed to load organizations'));
    }, []);

    useEffect(() => {
        if (!selectedOrg) return setProjects([]);
        fetch(`/api/organizations/${selectedOrg}`)
            .then(res => res.json())
            .then(org => setProjects(org.projects || []))
            .catch(() => setProjects([]));
    }, [selectedOrg]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            setSubmitting(true)
            setError('')

            if (issue) {
                await axiosInstance.patch('/api/issues/' + issue.id, data);
            } else {
                const response = await axiosInstance.post('/api/issues', data);
            }

            router.push('/issues/list')
            router.refresh();
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitting(false)
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'An unexpected error occurred while creating the issue');
            } else {
                setError('An unexpected error occurred while creating the issue');
            }
        }
    })

    return (
        <div className='max-w-xl'>
            {error && <Callout.Root color='red' className='mb-5'>
                <Callout.Text>
                    {error}
                </Callout.Text>
            </Callout.Root>}
            <form className='space-y-3'
                onSubmit={onSubmit} >
                {!issue && <>
                    <label className='block mb-1 font-medium'>Organization</label>
                    <select className='w-full border px-3 py-2 rounded mb-2' {...register('organizationId')} defaultValue=''>
                        <option value='' disabled>Select organization</option>
                        {organizations.map(org => (
                            <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                    </select>
                    <ErrorMessage>{errors.organizationId?.message}</ErrorMessage>
                    <label className='block mb-1 font-medium'>Project</label>
                    <select className='w-full border px-3 py-2 rounded mb-2' {...register('projectId')} defaultValue='' disabled={!selectedOrg}>
                        <option value='' disabled>Select project</option>
                        {projects.map(proj => (
                            <option key={proj.id} value={proj.id}>{proj.name}</option>
                        ))}
                    </select>
                    <ErrorMessage>{errors.projectId?.message}</ErrorMessage>
                    {selectedOrg && projects.length === 0 && (
                        <div className="mb-4 flex items-center gap-2">
                            <span className="text-sm text-gray-500">No projects found for this organization.</span>
                            <a
                                href={`/organizations/${selectedOrg}/projects/new`}
                                className="inline-flex items-center bg-brand text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors ml-2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                + Add Project
                            </a>
                        </div>
                    )}
                </>}
                {issue && <>
                    <input type="hidden" {...register('organizationId')} value={issue.organizationId || ''} />
                    <input type="hidden" {...register('projectId')} value={issue.projectId} />
                </>}
                <TextField.Root >
                    <TextField.Input defaultValue={issue?.title} placeholder="Title" {...register('title')} />
                </TextField.Root>
                <ErrorMessage>{errors.title?.message}</ErrorMessage>
                <Controller
                    name='description'
                    control={control}
                    defaultValue={issue?.description}
                    render={
                        ({ field }) =>
                            <SimpleMDE placeholder="Description" {...field} />
                    }
                />
                <ErrorMessage>{errors.description?.message}</ErrorMessage>
                <Button disabled={Boolean(isSubmitting || (selectedOrg && projects.length === 0))} type="submit">
                    {issue ? 'Update Issue' : 'Submit New Issue'}{' '}
                    {isSubmitting && <Spinner size={18} />}
                </Button>
            </form>
        </div>
    )
}

export default IssueForm