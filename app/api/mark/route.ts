import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

type IncomingStudentsData = { id: string; mark: number | undefined };

export async function POST(req: NextRequest) {
  try {
    await checkIsAdmin();

    const body = await req.json();

    const { studentsData, classId, examId, subjectId } = body;

    if (!studentsData || !classId || !examId || !subjectId)
      return new NextResponse("Required field is missing", { status: 400 });

    const filteredData = studentsData.filter(
      (d: IncomingStudentsData) => !!d.mark
    );

    const updatedMark = await prisma.$transaction(
      filteredData.map(({ id, mark }: { id: string; mark: number }) =>
        prisma.mark.upsert({
          where: {
            examId_studentId_subjectId: {
              examId,
              studentId: id,
              subjectId,
            },
          },
          update: {
            obtained: mark,
          },
          create: {
            studentId: id,
            examId,
            subjectId,
            obtained: mark,
          },
        })
      )
    );

    return NextResponse.json({ message: "Mark updated successfully." });
  } catch (error) {
    console.log("[MARK_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
