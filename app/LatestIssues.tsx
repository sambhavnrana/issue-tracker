import prisma from '@/prisma/client'
import { Avatar, Card, Flex, Heading, Table, TableRoot } from '@radix-ui/themes';
import React from 'react'
import { IssueStatusBadge } from './components';
import Link from 'next/link';

const LatestIssues = async () => {
    const issues = await prisma.issue.findMany({

        orderBy: {
            createdAt: 'desc'
        },
        take: 5,
        include: {
            assignedToUser: true
        }
    });
    return (
        <Card className='shadow-xl'
            style={{ border: '1px solid #ec4899' }}
        >
            <Heading size="5" mb="5" className="flex items-center gap-2 text-gray-800">
                Latest Issues
                <span className="text-sm font-normal text-gray-600  hidden sm:inline">
                    - Click to get more info
                </span>
            </Heading>

            <TableRoot>
                <Table.Body>
                    {issues.map(issue => (
                        <Table.Row key={issue.id}>
                            <Table.Cell>
                                <Flex justify="between" >
                                    <Flex direction="column" align="start" gap="2" >
                                        <Link href={`/issues/${issue.id}`} className='hover:underline hover:text-brand-dark'>
                                            {issue.title}
                                        </Link>
                                        <IssueStatusBadge status={issue.status} />
                                    </Flex>
                                    {issue.assignedToUser && (
                                        <Avatar
                                            src={issue.assignedToUser.image!}
                                            fallback="?"
                                            size="3"
                                            radius='full'
                                        />
                                    )}
                                </Flex>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </TableRoot>
        </Card>
    )
}

export default LatestIssues