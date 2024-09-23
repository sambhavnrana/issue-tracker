import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { auth } from '@/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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
  const { memberIds, name } = await req.json();
  if (!Array.isArray(memberIds)) {
    return NextResponse.json({ error: 'Invalid memberIds' }, { status: 400 });
  }
  // Update organization name if provided
  if (typeof name === 'string' && name.length > 0 && name !== org.name) {
    await prisma.organization.update({ where: { id: org.id }, data: { name } });
  }
  // Remove all current members
  await prisma.organizationMember.deleteMany({ where: { organizationId: org.id } });
  // Add new members (do NOT add creator unless in memberIds)
  if (memberIds.length > 0) {
    await prisma.organizationMember.createMany({
      data: memberIds.map((userId: string) => ({ userId, organizationId: org.id })),
      skipDuplicates: true,
    });
  }
  return NextResponse.json({ success: true });
} 