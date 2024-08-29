import { auth } from '@/auth';
import prisma from '@/prisma/client';
import { Box, Flex, Grid } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import AssigneeSelect from './AssigneeSelect';
import DeleteIssueButton from './DeleteIssueButton';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';

interface Props {
    params: { id: string }
}

const fetchUser = cache((issueId: number) => prisma.issue.findUnique({ where: { id: issueId } })
)

const IssuesDetailPage = async ({ params }: Props) => {
    const session = await auth();

    const issue = await fetchUser(parseInt(params.id))

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
    const issue = await fetchUser(parseInt(params.id))

    return {
        title: issue?.title,
        description: 'Details of Issue' + issue?.id
    }
}

export default IssuesDetailPage