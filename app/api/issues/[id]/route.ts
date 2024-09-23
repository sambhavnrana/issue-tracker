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

    // Allow only the creator to edit title/description, and only assignee/org member to change status
    const isOrgMember = issue.organization?.organizationMemberships.some((m: any) => m.userId === userId);
    const isAssignee = issue.assignedToUserId === userId;
    const isCreator = issue.organization?.creatorId === userId;

    const body = await request.json();
    const validation = patchIssueSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    // Only allow the creator to edit title/description
    if (("title" in validation.data || "description" in validation.data) && !isCreator) {
      return NextResponse.json({ error: "Only the creator can edit title or description." }, { status: 403 });
    }
    // Only allow assignee or org member to change status
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
      assignedToUserId: true
    }
  });

  if (!issue) {
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });
  }

  // Only creator or assignee can edit/delete
  const isAuthorized =
    issue?.createdById === userId ||
    issue?.assignedToUserId === userId;
  if (!isAuthorized) {
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
  // Authorization: assigned, or org member
  const isOrgMember = issue.organization?.organizationMemberships.some((m: any) => m.userId === userId);
  const isAuthorized = issue.assignedToUserId === userId || isOrgMember;
  if (!isAuthorized) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  return NextResponse.json(issue);
}
