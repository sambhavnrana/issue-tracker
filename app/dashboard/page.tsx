export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Flex, Grid } from "@radix-ui/themes";
import IssueChart from "../IssueChart"
import IssueSummary from "../IssueSummary";
import prisma from "@/prisma/client";
import LatestIssues from "../LatestIssues";
import { Metadata } from "next";
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-center text-red-700 font-medium">Not authenticated</div>;
  }
  const userId = session.user.id;

  const orgMemberships = await prisma.organizationMember.findMany({
    where: { userId },
    select: { organizationId: true },
  });
  const memberOrgIds = orgMemberships.map(m => m.organizationId);

  try {
    const [open, inProgress, closed] = await Promise.all([
      prisma.issue.count({
        where: {
          status: 'OPEN',
          OR: [
            { assignedToUserId: userId },
            { Project: { organization: { creatorId: userId } } },
            { organizationId: { in: memberOrgIds } },
          ],
        },
      }),
      prisma.issue.count({
        where: {
          status: 'IN_PROGRESS',
          OR: [
            { assignedToUserId: userId },
            { Project: { organization: { creatorId: userId } } },
            { organizationId: { in: memberOrgIds } },
          ],
        },
      }),
      prisma.issue.count({
        where: {
          status: 'CLOSED',
          OR: [
            { assignedToUserId: userId },
            { Project: { organization: { creatorId: userId } } },
            { organizationId: { in: memberOrgIds } },
          ],
        },
      }),
    ]);

    return (
      <Grid columns={{ initial: "1", md: "2" }} gap="5" >
        <Flex direction="column" gap="5" >
          <IssueSummary open={open} inProgress={inProgress} closed={closed} />
          <IssueChart open={open} inProgress={inProgress} closed={closed} />
        </Flex>
        <LatestIssues userId={userId} memberOrgIds={memberOrgIds} />
      </Grid>
    );
  } catch (error) {
    console.error('Error fetching issue counts:', error);
    return (
      <Grid columns={{ initial: "1", md: "2" }} gap="5" >
        <Flex direction="column" gap="5" >
          <IssueSummary open={0} inProgress={0} closed={0} />
          <IssueChart open={0} inProgress={0} closed={0} />
        </Flex>
        <LatestIssues userId={userId} memberOrgIds={memberOrgIds} />
      </Grid>
    );
  }
}

export const metadata: Metadata = {
  title: " Dashboard - TrackBuddy",
  description: "View a summary of your project issues",
}