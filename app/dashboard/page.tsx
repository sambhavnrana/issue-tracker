export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Flex, Grid } from "@radix-ui/themes";
import IssueChart from "../IssueChart"
import IssueSummary from "../IssueSummary";
import prisma from "@/prisma/client";
import LatestIssues from "../LatestIssues";
import { Metadata } from "next";

export default async function Home() {
  try {
    const [open, inProgress, closed] = await Promise.all([
      prisma.issue.count({
        where: { status: 'OPEN' }
      }),
      prisma.issue.count({
        where: { status: 'IN_PROGRESS' }
      }),
      prisma.issue.count({
        where: { status: 'CLOSED' }
      })
    ]);

    return (
      <Grid columns={{ initial: "1", md: "2" }} gap="5" >
        <Flex direction="column" gap="5" >
          <IssueSummary open={open} inProgress={inProgress} closed={closed} />
          <IssueChart open={open} inProgress={inProgress} closed={closed} />
        </Flex>
        <LatestIssues />
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
        <LatestIssues />
      </Grid>
    );
  }
}

export const metadata: Metadata = {
  title: " Dashboard - TrackBuddy",
  description: "View a summary of your project issues",
}