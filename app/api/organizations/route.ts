import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { auth } from '@/auth';

// POST /api/organizations/create-new
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { name, memberIds } = await req.json();
  if (!name || !Array.isArray(memberIds)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
  try {
    const creator = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!creator) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Create the organization without members
    const organization = await prisma.organization.create({
      data: {
        name,
        creatorId: creator.id,
      },
    });
    // Add members to the OrganizationMember join table (do NOT add creator unless in memberIds)
    if (Array.isArray(memberIds) && memberIds.length > 0) {
      await prisma.organizationMember.createMany({
        data: memberIds.map((userId: string) => ({
          userId,
          organizationId: organization.id,
        })),
        skipDuplicates: true,
      });
    }
    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  }
}

// GET /api/organizations
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Only organizations where the user is the creator
    const organizations = await prisma.organization.findMany({
      where: { creatorId: user.id },
      include: {
        _count: {
          select: { organizationMemberships: true }
        }
      }
    });
    return NextResponse.json(organizations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
} 