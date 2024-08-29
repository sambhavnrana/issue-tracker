import prisma from '@/prisma/client';
import { Box, Flex, Grid } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import DeleteIssueButton from './DeleteIssueButton';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import { auth } from '@/auth';
import AssigneeSelect from './AssigneeSelect';
import { title } from 'process';

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
                        <AssigneeSelect issue={issue} />
                        <EditIssueButton issueId={issue.id} />
                        <DeleteIssueButton issueId={issue.id} />
                    </Flex>
                </Box>
            )}
        </Grid>
    )
}

export async function generateMetadata({ params }: Props) {
    const issue = await prisma.issue.findUnique({ where: { id: parseInt(params.id) } })

    return {
        title: issue?.title,
        description: 'Details of Issue' + issue?.id
    }
}

export default IssuesDetailPage