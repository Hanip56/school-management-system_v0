import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 404 });

    const paramActive = req.nextUrl.searchParams.get("active");

    let filter = {};

    if (paramActive) {
      filter = {
        ...filter,
        active:
          paramActive === "true"
            ? true
            : paramActive === "false"
            ? false
            : undefined,
      };
    }

    const academicYears = await prisma.academicYear.findMany({
      where: filter,
    });

    return NextResponse.json(academicYears);
  } catch (error) {
    console.log("[ACADEMIC_YEAR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 404 });

    const { yearStart, yearEnd } = await req.json();

    if (!yearStart || !yearEnd)
      return new NextResponse("Required field is missing", { status: 400 });

    const academicYear = await prisma.academicYear.create({
      data: {
        yearStart,
        yearEnd,
        active: true,
      },
    });

    //   disactive other active years
    const updates = await prisma.academicYear.updateMany({
      where: {
        NOT: {
          id: academicYear.id,
        },
        active: true,
      },
      data: {
        active: false,
      },
    });

    return NextResponse.json(academicYear);
  } catch (error) {
    console.log("[ACADEMIC_YEAR_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
