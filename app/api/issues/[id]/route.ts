import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { issueSchema, patchIssueSchema } from "@/app/validationSchemas";
import { auth } from "@/auth";
import { User, Prisma } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    type IssueWithOrgAndMemberships = Prisma.IssueGetPayload<{
      include: {
        Project: true,
        organization: {
          include: {
            organizationMemberships: true
          }
        }
      }
    }>;

    const issue: IssueWithOrgAndMemberships | null = await prisma.issue.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        Project: true,
        organization: {
          include: {
            organizationMemberships: true
          }
        }
      }
    });

    if (!issue) {
      return NextResponse.json({ error: "Invalid issue" }, { status: 404 });
    }

    const isOrgMember = issue.organization?.organizationMemberships.some((m: any) => m.userId === userId);
    const isAssignee = issue.assignedToUserId === userId;
    const isCreator = issue.createdById === userId;
    const isOrgOwner = issue.organization?.creatorId === userId;

    const body = await request.json();
    const validation = patchIssueSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    if (("title" in validation.data || "description" in validation.data) && !(isCreator || isOrgOwner)) {
      return NextResponse.json({ error: "Only the organization owner or issue creator can edit this issue." }, { status: 403 });
    }
    if ("status" in validation.data && !(isAssignee || isOrgMember)) {
      return NextResponse.json({ error: "Only the assignee or org member can change status." }, { status: 403 });
    }

    const updatedIssue = await prisma.issue.update({
      where: { id: issue.id },
      data: validation.data,
      include: {
        Project: true
      }
    });
    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
    select: {
      id: true,
      createdById: true,
      organization: { select: { creatorId: true } }
    }
  });

  if (!issue) {
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });
  }

  const isCreator = issue.createdById === userId;
  const isOrgOwner = issue.organization?.creatorId === userId;
  if (!(isCreator || isOrgOwner)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await prisma.issue.delete({
    where: { id: issue.id },
  });

  return NextResponse.json({});
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  type IssueWithOrgAndMemberships = Prisma.IssueGetPayload<{
    include: {
      organization: {
        include: {
          organizationMemberships: true
        }
      },
      Project: true,
      assignee: true,
      creator: true,
    }
  }>;

  const issue: IssueWithOrgAndMemberships | null = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      organization: {
        include: {
          organizationMemberships: true
        }
      },
      Project: true,
      assignee: true,
      creator: true,
    }
  });
  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }
  const isOrgMember = issue.organization?.organizationMemberships.some((m: any) => m.userId === userId);
  const isAuthorized = issue.assignedToUserId === userId || isOrgMember;
  if (!isAuthorized) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  return NextResponse.json(issue);
}
