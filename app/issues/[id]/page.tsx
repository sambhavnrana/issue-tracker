import IssueDetailClient from './IssueDetailClient';
import prisma from '@/prisma/client';

export default function IssueDetailPage() {
  return <IssueDetailClient />;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) }
  });

    return {
    title: issue?.title || 'Issue',
    description: 'Details of Issue ' + (issue?.id ?? '')
    }
}