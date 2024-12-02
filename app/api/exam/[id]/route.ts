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

    const exam = await prisma.exam.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!exam) return new NextResponse("Exam not found", { status: 404 });

    const updatedExam = await prisma.exam.update({
      where: {
        id: params.id,
      },
      data: {
        classId: body?.classId === "" ? { unset: true } : body.classId,
        name: body?.name ?? undefined,
        description: body?.description ?? undefined,
      },
    });

    return NextResponse.json(updatedExam);
  } catch (error) {
    console.log("[EXAM_ID_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await checkIsAdmin();

    const exam = await prisma.exam.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!exam) return new NextResponse("Exam not found", { status: 404 });

    const deletedExam = await prisma.exam.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: `Exam with id:${deletedExam.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[EXAM_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
