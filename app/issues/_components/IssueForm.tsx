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
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { z } from 'zod';
import SimpleMDE from 'react-simplemde-editor';

type IssueFormData = z.infer<typeof issueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors } } = useForm<IssueFormData>({
        resolver: zodResolver(issueSchema)
    });
    const [error, setError] = useState('')
    const [isSubmitting, setSubmitting] = useState(false)

    const onSubmit = handleSubmit(async (data) => {
        try {
            setSubmitting(true)
            setError('')

            if (issue) {
                await axios.patch('/api/issues/' + issue.id, data);
            } else {
                const response = await axios.post('/api/issues', data);
            }

            router.push('/issues/list')
            router.refresh(); // refresh the page to get the updated data
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
                <Button disabled={isSubmitting}>
                    {issue ? 'Update Issue' : 'Submit New Issue'}{' '}
                    {isSubmitting && <Spinner />}
                </Button>
            </form>
        </div>
    )
}

export default IssueForm