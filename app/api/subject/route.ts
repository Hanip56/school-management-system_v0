import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, academicYearId } = await req.json();

    if (!name)
      return new NextResponse("Required field is missing", { status: 400 });

    const foundSubject = await prisma.subject.findUnique({
      where: {
        name_academicYearId: {
          name,
          academicYearId,
        },
      },
    });

    if (foundSubject)
      return new NextResponse("Subject name must be unique", { status: 400 });

    const classResult = await prisma.subject.create({
      data: {
        name,
        academicYearId,
      },
    });

    return NextResponse.json(classResult);
  } catch (error) {
    console.log("[SUBJECT_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
