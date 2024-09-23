import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Find all organization IDs where the user is a member
    const orgMemberships = await prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      select: { organizationId: true },
    });
    const memberOrgIds = orgMemberships.map(m => m.organizationId);

    // Get all projects from organizations where user is a member
    const projects = await prisma.project.findMany({
      where: {
        organizationId: { in: memberOrgIds }
      },
      include: {
        organization: {
          select: {
            name: true
          }
        }
      },
      orderBy: [
        { organization: { name: 'asc' } },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching available projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
} 