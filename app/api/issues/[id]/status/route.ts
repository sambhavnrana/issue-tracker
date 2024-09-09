import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { auth } from "@/auth";
import { Status } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({}, { status: 401 });

    const body = await request.json();
    const { status } = body;

    if (!Object.values(Status).includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const issue = await prisma.issue.update({
      where: { id: parseInt(params.id) },
      data: { status },
    });

    return NextResponse.json(issue);
  } catch (error) {
    console.error('Error updating issue status:', error);
    return NextResponse.json(
      { error: "Error updating issue status" },
      { status: 500 }
    );
  }
} 