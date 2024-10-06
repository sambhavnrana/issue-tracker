import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { issueSchema } from "../../validationSchemas";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    console.log('Session:', session);

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received body:', body);

    const validation = issueSchema.safeParse(body);
    if (!validation.success) {
      console.log('Validation failed:', validation.error);
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const newIssue = await prisma.issue.create({
      data: { 
        title: body.title, 
        description: body.description,
        status: 'OPEN' // Set default status
      },
    });

    console.log('Created issue:', newIssue);
    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json(
      { message: "Error creating issue", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
