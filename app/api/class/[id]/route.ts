import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.id) return new NextResponse("Class not found", { status: 404 });

    const foundClass = await prisma.class.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!foundClass)
      return new NextResponse("Class not found", { status: 404 });

    const body = await req.json();

    const updatedClass = await prisma.class.update({
      where: {
        id: params.id,
      },
      data: {
        name: body?.name,
      },
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.log("[CLASS_DELETE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.id) return new NextResponse("Class not found", { status: 404 });

    const foundClass = await prisma.class.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!foundClass)
      return new NextResponse("Class not found", { status: 404 });

    const deletedClass = await prisma.class.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: `Class with id:${deletedClass.id} has been deleted`,
    });
  } catch (error) {
    console.log("[CLASS_DELETE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
