import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const feeCategory = await prisma.feeCategory.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!feeCategory)
      return new NextResponse("Fee category not found", { status: 404 });

    const updatedFeeCategory = await prisma.feeCategory.update({
      where: {
        id: params.id,
      },
      data: {
        name: body?.name ?? undefined,
        type: body?.type ?? undefined,
      },
    });

    return NextResponse.json(updatedFeeCategory);
  } catch (error) {
    console.log("[FEE-CATEGORY_ID_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const feeCategory = await prisma.feeCategory.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!feeCategory)
      return new NextResponse("Fee category not found", { status: 404 });

    const deletedFeeCategory = await prisma.feeCategory.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: `Fee category with id:${deletedFeeCategory.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[FEE-CATEGORY_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
