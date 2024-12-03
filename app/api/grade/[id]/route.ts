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

    const grade = await prisma.grade.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!grade) return new NextResponse("Grade not found", { status: 404 });

    const updatedGrade = await prisma.grade.update({
      where: {
        id: params.id,
      },
      data: {
        examId: body?.examId ?? undefined,
        name: body?.name ?? undefined,
        fromPercentage: body?.fromPercentage ?? undefined,
        toPercentage: body?.toPercentage ?? undefined,
      },
    });

    return NextResponse.json(updatedGrade);
  } catch (error) {
    console.log("[GRADE_ID_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await checkIsAdmin();

    const grade = await prisma.grade.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!grade) return new NextResponse("Grade not found", { status: 404 });

    const deletedGrade = await prisma.grade.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: `Grade with id:${deletedGrade.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[GRADE_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
