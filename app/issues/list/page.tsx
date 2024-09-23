import Pagination from '@/app/components/Pagination';
import prisma from '@/prisma/client';
import { Issue_status } from '@prisma/client';
import { auth } from '@/auth';

import IssueActions from './IssueActions';
import IssueTable, { columnNames, IssueQuery } from './IssueTable';
import { Flex } from '@radix-ui/themes';
import { Metadata } from 'next';
interface Props {
  searchParams: IssueQuery
}

const IssuesPage = async ({ searchParams }: Props) => {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-center text-red-700 font-medium">Not authenticated</div>;
  }
  const userId = session.user.id;

  // Find all organization IDs where the user is a member
  const orgMemberships = await prisma.organizationMember.findMany({
    where: { userId },
    select: { organizationId: true },
  });
  const memberOrgIds = orgMemberships.map(m => m.organizationId);

  const statuses = Object.values(Issue_status)
  const status = statuses.includes(searchParams.status) ? searchParams.status : undefined;
  const projectId = searchParams.projectId;

  const where = {
    status,
    ...(projectId && { projectId }),
    OR: [
      { assignedToUserId: userId },
      { Project: { organization: { creatorId: userId } } },
      { organizationId: { in: memberOrgIds } },
    ],
  };

  const orderBy = columnNames
    .includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: 'asc' } : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: { organization: true, creator: true },
  });

  const issueCount = await prisma.issue.count({ where })

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssueTable searchParams={searchParams} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  )
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: " Issue List - TrackBuddy ",
  description: "View all your project issues",
}

export default IssuesPage;