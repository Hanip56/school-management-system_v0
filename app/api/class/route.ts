import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 404 });

    const { name, academicYearId } = await req.json();

    if (!name)
      return new NextResponse("Required field is missing", { status: 400 });

    const foundClass = await prisma.class.findUnique({
      where: {
        name_academicYearId: {
          name,
          academicYearId,
        },
      },
    });

    if (foundClass)
      return new NextResponse("Class name must be unique", { status: 400 });

    const classResult = await prisma.class.create({
      data: {
        name,
        academicYearId,
      },
    });

    return NextResponse.json(classResult);
  } catch (error) {
    console.log("[CLASS_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
