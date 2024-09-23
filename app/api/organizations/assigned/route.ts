import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { auth } from '@/auth';

// GET /api/organizations/assigned
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const organizations = await prisma.organization.findMany({
      where: {
        organizationMemberships: {
          some: { userId: session.user.id }
        },
        NOT: { creatorId: session.user.id }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: { select: { organizationMemberships: true } }
      }
    });
    return NextResponse.json(organizations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assigned organizations' }, { status: 500 });
  }
} 