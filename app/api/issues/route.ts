import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { auth } from "@/auth";
import { issueSchema } from "@/app/validationSchemas";
import { Issue_status } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const validation = issueSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const { title, description, projectId, organizationId } = validation.data;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        projectId,
        organizationId,
        status: "OPEN" as Issue_status,
        updatedAt: new Date(),
        createdById: session.user.id,
      },
    });

    return NextResponse.json(issue, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find all organization IDs where the user is a member
    const orgMemberships = await prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      select: { organizationId: true },
    });
    const memberOrgIds = orgMemberships.map(m => m.organizationId);

    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");

    // Only allow issues for projects in organizations where the user is a member, or issues assigned to the user
    const where: any = {
      OR: [
        { assignedToUserId: session.user.id },
        { organizationId: { in: memberOrgIds } },
      ]
    };
    if (projectId) {
      where.projectId = projectId;
    }

    // Then get all issues for the project/org membership
    const issues = await prisma.issue.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        assignee: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(issues);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
