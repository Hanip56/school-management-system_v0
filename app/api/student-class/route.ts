import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await checkIsAdmin();

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 1;
    const updatedAt =
      Number(req.nextUrl.searchParams.get("updatedAt")) || "desc";
    const search = req.nextUrl.searchParams.get("search") || "";
    let orderBy: Record<string, string> = {};

    if (typeof updatedAt === "string") {
      orderBy = {
        updatedAt,
      };
    }

    const classId = req.nextUrl.searchParams.get("classId") || "";
    const studentId = req.nextUrl.searchParams.get("studentId") || "";

    let where: Prisma.StudentClassWhereInput | undefined;

    if (classId) {
      where = {
        ...where,
        classId: classId,
      };
    }

    if (studentId) {
      where = {
        ...where,
        studentId: studentId,
      };
    }

    const studentClassCount = await prisma.studentClass.count({
      where,
    });

    const studentClass = await prisma.studentClass.findMany({
      where,
      include: {
        student: {
          select: {
            classes: true,
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: limit * (page - 1),
      orderBy,
    });

    return NextResponse.json({
      total_items: studentClassCount,
      data: studentClass,
    });
  } catch (error) {
    console.log("[STUDENT_CLASS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await checkIsAdmin();

    const { classId, academicYearId, studentIds } = await req.json();

    if (!classId || !academicYearId || !studentIds)
      return new NextResponse("Required field is missing", { status: 400 });

    if (studentIds?.length < 1)
      return new NextResponse("No content", { status: 204 });

    const classExist = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classExist)
      return new NextResponse("Class not found", { status: 404 });

    const academicYearExist = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });

    if (!academicYearExist)
      return new NextResponse("Academic year not found", { status: 404 });

    const studentClasses = await prisma.studentClass.createMany({
      data: studentIds.map((studentId: string) => ({
        classId,
        academicYearId,
        studentId,
      })),
    });

    console.log(studentClasses);

    return NextResponse.json(studentClasses);
  } catch (error) {
    console.log("[STUDENT_CLASS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
