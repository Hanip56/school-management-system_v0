import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    checkIsAdmin();

    const body = await req.json();

    const teacher = await prisma.teacher.findUnique({
      where: {
        userId: params.userId,
      },
    });

    if (!teacher) return new NextResponse("Teacher not found", { status: 404 });

    const updatedTeacher = await prisma.teacher.update({
      where: {
        userId: params.userId,
      },
      data: {
        ...body,
        user: {
          update: {
            username: body?.username ?? undefined,
            email: body?.email ?? undefined,
          },
        },
        // must be turn to undefined cause these fields are for user entity only
        username: undefined,
        password: undefined,
        email: undefined,
        role: undefined,
      },
    });

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.log("[TEACHERS_ID_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}