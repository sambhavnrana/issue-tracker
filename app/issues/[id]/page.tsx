import prisma from '@/prisma/client'
import { notFound } from 'next/navigation';
import { Box, Grid } from '@radix-ui/themes';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';

interface Props {
    params: { id: string }
}

const IssuesDetailPage = async ({ params }: Props) => {

    const issue = await prisma.issue.findUnique({
        where: {
            id: parseInt(params.id)
        }
    });

    if (!issue)
        notFound();

    return (
        <Grid columns={{ initial: "1", md: "2" }} gap="5">
            <Box>
                <IssueDetails issue={issue} />
            </Box>
            <Box>
                <EditIssueButton issueId={issue.id} />
            </Box>
        </Grid>
    )
}

export default IssuesDetailPage