import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { auth } from '@/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const org = await prisma.organization.findUnique({ where: { id: params.id } });
  if (!org) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }
  if (org.creatorId !== session.user.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  const { name, description } = await req.json();
  if (!name || typeof name !== 'string' || name.length < 1) {
    return NextResponse.json({ error: 'Invalid project name' }, { status: 400 });
  }
  const project = await prisma.project.create({
    data: {
      name,
      description,
      organizationId: org.id,
    },
  });
  return NextResponse.json(project, { status: 201 });
} 