import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

// activate academic-year
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 404 });

    if (!params.id)
      return new NextResponse("Academic Year not found", { status: 404 });

    const academicYear = await prisma.academicYear.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!params.id)
      return new NextResponse("Academic Year not found", { status: 404 });

    const body = await req.json();

    // activing year
    const academicYearUpdated = await prisma.academicYear.update({
      where: {
        id: params.id,
      },
      data: {
        active: body?.active ?? undefined,
      },
    });

    //   disactive other active years
    const updates = await prisma.academicYear.updateMany({
      where: {
        NOT: {
          id: params.id,
        },
        active: true,
      },
      data: {
        active: false,
      },
    });

    return NextResponse.json(academicYearUpdated);
  } catch (error) {
    console.log("[ACADEMIC_YEAR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
