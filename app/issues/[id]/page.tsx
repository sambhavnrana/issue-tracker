import { auth } from '@/auth';
import prisma from '@/prisma/client';
import { Box, Flex, Grid } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import AssigneeSelect from './AssigneeSelect';
import DeleteIssueButton from './DeleteIssueButton';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import StatusSelect from './StatusSelect';

interface Props {
    params: { id: string }
}

const fetchIssue = cache(async (issueId: number) => {
    const issue = await prisma.issue.findUnique({
        where: { id: issueId }
    });
    if (!issue) notFound();
    return issue;
});

const IssueDetailPage = async ({ params }: Props) => {
    const issue = await fetchIssue(parseInt(params.id));
    const session = await auth();

    return (
        <Grid columns={{ initial: "1", md: "2" }} gap="5">
            <Box>
                <IssueDetails issue={issue} />
            </Box>
            <Box>
                <Flex direction="column" gap="4">
                    <AssigneeSelect issue={issue} />
                    <StatusSelect issue={issue} />
                    {session && (
                        <Flex gap="3">
                            <EditIssueButton issueId={issue.id} />
                            <DeleteIssueButton issueId={issue.id} />
                        </Flex>
                    )}
                </Flex>
            </Box>
        </Grid>
    )
}

export async function generateMetadata({ params }: Props) {
    const issue = await fetchIssue(parseInt(params.id))

    return {
        title: issue?.title,
        description: 'Details of Issue' + issue?.id
    }
}

export default IssueDetailPage