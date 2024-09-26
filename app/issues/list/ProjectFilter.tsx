"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Project {
  id: string;
  name: string;
  organizationId: string;
  organization: {
    name: string;
  };
}

const ProjectFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/projects/available')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProjects(data);
                }
                setLoading(false);
            })
            .catch(() => {
                setProjects([]);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <select disabled className="w-full sm:w-52 border border-brand-light rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-400">
                <option>All Projects</option>
            </select>
        );
    }

    return (
        <select
            className="w-full sm:w-52 border border-brand-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white text-black"
            value={searchParams.get('projectId') || ''}
            onChange={e => {
                const projectId = e.target.value;
                const params = new URLSearchParams();
                if (projectId) params.append('projectId', projectId)
                if (searchParams.get('status'))
                    params.append('status', searchParams.get('status')!)
                if (searchParams.get('orderBy'))
                    params.append('orderBy', searchParams.get('orderBy')!)
                const query = params.size ? '?' + params.toString() : ''
                router.push('/issues/list' + query)
            }}
        >
            <option value="">All Projects</option>
            {projects.map(project => (
                <option key={project.id} value={project.id}>
                    {project.name} ({project.organization.name})
                </option>
            ))}
        </select>
    )
}

export default ProjectFilter 