import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { auth } from '@/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
      include: {
        organizationMemberships: {
          include: { user: true }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        projects: true
      }
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const isMember = organization.organizationMemberships.some(
      (m: any) => m.userId === userId
    );

    if (!isMember) {
      return NextResponse.json({ error: 'Not authorized to view this organization' }, { status: 403 });
    }

    return NextResponse.json(organization);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch organization' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const { name } = await req.json();
    
    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
      select: { creatorId: true }
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    if (organization.creatorId !== userId) {
      return NextResponse.json({ error: 'Only the creator can edit the organization name' }, { status: 403 });
    }

    const updatedOrg = await prisma.organization.update({
      where: { id: params.id },
      data: { name }
    });

    return NextResponse.json(updatedOrg);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
      select: { 
        creatorId: true,
        name: true,
        _count: {
          select: {
            projects: true,
            organizationMemberships: true
          }
        }
      }
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    if (organization.creatorId !== userId) {
      return NextResponse.json({ error: 'Only the creator can delete the organization' }, { status: 403 });
    }

    await prisma.organization.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json({ error: 'Failed to delete organization' }, { status: 500 });
  }
} 