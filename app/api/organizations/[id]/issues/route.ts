import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { auth } from '@/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const { id } = params;
  const isMember = await prisma.organizationMember.findFirst({
    where: { organizationId: id, userId: session.user.id }
  });
  if (!isMember) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  const issues = await prisma.issue.findMany({
    where: { organizationId: id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(issues);
} 