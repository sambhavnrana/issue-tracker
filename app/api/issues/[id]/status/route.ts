import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { auth } from "@/auth";
import { z } from 'zod';
import { Issue_status } from "@prisma/client";

const statusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED'] as [Issue_status, ...Issue_status[]]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const validation = statusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const { status } = validation.data;

    const issue = await prisma.issue.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        Project: true,
      },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const isAuthorized =
      issue.createdById === session.user.id ||
      issue.assignedToUserId === session.user.id;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Not authorized to update this issue" },
        { status: 403 }
      );
    }

    const updatedIssue = await prisma.issue.update({
      where: { id: issue.id },
      data: { status },
    });

    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the issue status" },
      { status: 500 }
    );
  }
}