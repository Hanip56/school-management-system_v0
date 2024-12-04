import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await checkIsAdmin();
    const classId = req.nextUrl.searchParams.get("classId") || "";
    const examId = req.nextUrl.searchParams.get("examId") || "";
    const subjectId = req.nextUrl.searchParams.get("subjectId") || "";

    if (!classId || !examId || !subjectId)
      return new NextResponse("Required field is missing", { status: 400 });

    const students = await prisma.student.findMany({
      where: {
        classes: {
          some: {
            classId,
          },
        },
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        marks: {
          where: {
            examId,
            subjectId,
          },
        },
      },
    });

    return NextResponse.json({
      data: students,
    });
  } catch (error) {
    console.log("[STUDENTS_STUDENTS-MARK_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
