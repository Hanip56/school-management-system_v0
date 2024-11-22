import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await checkIsAdmin();

    const body = await req.json();

    console.log({ body });

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!lesson) return new NextResponse("Lesson not found", { status: 404 });

    const updatedLesson = await prisma.lesson.update({
      where: {
        id: params.id,
      },
      data: {
        classId: body?.classId ?? undefined,
        teacherId: body?.teacherId ?? undefined,
        subjectId: body?.subjectId ?? undefined,
        timeStart: body?.timeStart ?? undefined,
        timeEnd: body?.timeEnd ?? undefined,
        academicYearId: body?.academicYearId ?? undefined,
      },
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.log("[LESSON_ID_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await checkIsAdmin();

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!lesson) return new NextResponse("Lesson not found", { status: 404 });

    const deletedLesson = await prisma.lesson.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: `Lesson with id:${deletedLesson.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[LESSON_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
