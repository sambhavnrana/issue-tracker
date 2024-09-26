'use client';

import dynamic from 'next/dynamic';
import IssueFormSkeleton from './loading';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const IssueForm = dynamic(
    () => import('@/app/issues/_components/IssueForm'),
    {
        ssr: false,
        loading: () => <IssueFormSkeleton />
    }
)

const NewIssuePage = () => {
    const [orgs, setOrgs] = useState<any[] | null>(null);
    const [projects, setProjects] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/organizations/all').then(res => res.json()),
            fetch('/api/projects/available').then(res => res.json()),
        ]).then(([orgs, projects]) => {
            setOrgs(orgs);
            setProjects(projects);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return <IssueFormSkeleton />;

    if (!orgs || orgs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="mb-6">
                    <svg className="mx-auto h-16 w-16 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">No Organizations Found</h2>
                <p className="text-gray-600 mb-6">You need to create an organization before you can create issues.</p>
                <Link href="/organizations/new" className="inline-flex items-center bg-brand text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold hover:bg-brand-dark transition-colors">
                    + Create Organization
                </Link>
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="mb-6">
                    {/* <svg className="mx-auto h-16 w-16 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg> */}
                </div>
                <h2 className="text-2xl font-bold mb-2">No Projects Found</h2>
                <br />
                <p className="text-gray-600 mb-6 text-lg">You need to create a project before you can create issues.</p>
                <Link href="/organizations" className="inline-flex items-center bg-brand text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold hover:bg-brand-dark transition-colors hover:scale-105">
                    + Create Project
                </Link>
            </div>
        );
    }

    return <IssueForm />;
}

export default NewIssuePage;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};