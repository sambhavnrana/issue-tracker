import prisma from '@/prisma/client'
import { Avatar, Card, Heading } from '@radix-ui/themes';
import React from 'react'
import { IssueStatusBadge } from './components';
import Link from 'next/link';

const LatestIssues = async ({ userId, memberOrgIds }: { userId: string, memberOrgIds: string[] }) => {
    const issues = await prisma.issue.findMany({
        where: {
            OR: [
                { assignedToUserId: userId },
                { Project: { organization: { creatorId: userId } } },
                { organizationId: { in: memberOrgIds } },
            ]
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5,
        include: {
            creator: true
        }
    });
    return (
        <Card className='shadow-2xl border border-brand-light bg-white'>
            <Heading size="5" mb="5" className="flex items-center gap-2 ">
                Latest Issues
                <span className="text-sm font-normal hidden sm:inline">
                    - Click to get more info
                </span>
            </Heading>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand overflow-hidden rounded-lg text-xs sm:text-sm">
            <thead className="bg-brand-light ">
                        <tr>
                            <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Title</th>
                            <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                            <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Creator</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-brand-light">
                        {issues.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center text-sm sm:text-lg md:pt-12 lg:pt-36 py-6 sm:py-8 text-gray-600 font-medium">
                                    No issues present currently. Enjoy...
                                </td>
                            </tr>
                        ) : (
                            issues.map(issue => (
                                <tr key={issue.id} className=" transition-colors hover:bg-pink-50">
                                    <td className="px-2 sm:px-3 md:px-4 py-2">
                                        <Link href={`/issues/${issue.id}`} className=' text-blue-700 hover:underline hover:text-brand-dark font-medium text-xs sm:text-sm'>
                                            {issue.title}
                                        </Link>
                                    </td>
                                    <td className="px-2 sm:px-3 md:px-4 py-2">
                                        <IssueStatusBadge status={issue.status} />
                                    </td>
                                    <td className="px-2 sm:px-3 md:px-4 py-2">
                                        {issue.creator && (
                                            <Avatar
                                                src={issue.creator.image!}
                                                fallback={issue.creator.name?.[0] || '?'}
                                                size="3"
                                                radius='full'
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

export default LatestIssues