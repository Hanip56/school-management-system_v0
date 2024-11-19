import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id)
      return new NextResponse("Subject not found", { status: 404 });

    const foundSubject = await prisma.subject.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!foundSubject)
      return new NextResponse("Subject not found", { status: 404 });

    const body = await req.json();

    const updatedSubject = await prisma.subject.update({
      where: {
        id: params.id,
      },
      data: {
        name: body?.name,
      },
    });

    return NextResponse.json(updatedSubject);
  } catch (error) {
    console.log("[SUBJECT_DELETE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id)
      return new NextResponse("Subject not found", { status: 404 });

    const foundSubject = await prisma.subject.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!foundSubject)
      return new NextResponse("Subject not found", { status: 404 });

    const deletedSubject = await prisma.subject.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: `Subject with id:${deletedSubject.id} has been deleted`,
    });
  } catch (error) {
    console.log("[SUBJECT_DELETE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
