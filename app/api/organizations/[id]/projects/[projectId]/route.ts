import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { auth } from '@/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string; projectId: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
      include: {
        organization: {
          include: {
            organizationMemberships: {
              include: { user: true }
            }
          }
        },
        Issue: {
          include: {
            creator: true,
            assignee: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user is a member of the organization
    const isMember = project.organization.organizationMemberships.some(
      (m: any) => m.userId === userId
    );
    
    if (!isMember) {
      return NextResponse.json({ error: 'Not authorized to view this project' }, { status: 403 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string; projectId: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { name, description } = await req.json();
    
    // Check if user is the creator of the organization
    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
      select: { creatorId: true }
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    if (organization.creatorId !== userId) {
      return NextResponse.json({ error: 'Only the organization creator can edit projects' }, { status: 403 });
    }

    // Check if project exists and belongs to the organization
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
      select: { organizationId: true }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.organizationId !== params.id) {
      return NextResponse.json({ error: 'Project does not belong to this organization' }, { status: 403 });
    }

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id: params.projectId },
      data: { 
        name: name || undefined,
        description: description || undefined
      }
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
} 