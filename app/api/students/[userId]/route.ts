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

    const student = await prisma.student.findUnique({
      where: {
        userId: params.userId,
      },
    });

    if (!student) return new NextResponse("Student not found", { status: 404 });

    const updatedTeacher = await prisma.student.update({
      where: {
        userId: params.userId,
      },
      data: {
        user: {
          update: {
            username: body?.user?.username ?? undefined,
            email: body?.user?.email ?? undefined,
          },
        },
      },
    });

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.log("[STUDENTS_ID_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
