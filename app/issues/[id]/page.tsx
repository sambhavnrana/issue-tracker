import prisma from '@/prisma/client';
import { Box, Flex, Grid } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import DeleteIssueButton from './DeleteIssueButton';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import { auth } from '@/auth';

interface Props {
    params: { id: string }
}

const IssuesDetailPage = async ({ params }: Props) => {
    const session = await auth();

    const issue = await prisma.issue.findUnique({
        where: {
            id: parseInt(params.id)
        }
    });

    if (!issue)
        notFound();

    return (
        <Grid columns={{ initial: "1", sm: "5" }} gap="5">
            {/* md in radix-ui represents laptops, but in tailwind , lg represents laptops, so therefore using md:col-span-4 */}
            <Box className='md:col-span-4'>
                <IssueDetails issue={issue} />
            </Box>
            {session && (
                <Box>
                    <Flex direction="column" gap="4">
                        <EditIssueButton issueId={issue.id} />
                        <DeleteIssueButton issueId={issue.id} />
                    </Flex>
                </Box>
            )}
        </Grid>
    )
}

export default IssuesDetailPage