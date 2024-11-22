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
    const currentAcademicYearId =
      req.nextUrl.searchParams.get("academicYearId") || "";

    let orderBy: Record<string, string> = {};

    if (typeof updatedAt === "string") {
      orderBy = {
        updatedAt,
      };
    }

    let where: Prisma.LessonWhereInput | undefined;

    if (currentAcademicYearId) {
      where = {
        academicYearId: currentAcademicYearId,
      };
    }

    const total_items = await prisma.lesson.count({
      where,
    });

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        class: true,
        subject: true,
        teacher: true,
      },
      take: limit,
      skip: limit * (page - 1),
      orderBy,
    });

    return NextResponse.json({
      data: lessons,
      total_items,
    });
  } catch (error) {
    console.log("[LESSONS_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await checkIsAdmin();

    const body = await req.json();

    const {
      classId,
      subjectId,
      teacherId,
      timeStart,
      timeEnd,
      academicYearId,
    } = body;

    if (!classId || !subjectId || !teacherId || !timeStart || !timeEnd) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const lesson = await prisma.lesson.create({
      data: {
        timeStart,
        timeEnd,
        classId,
        subjectId,
        teacherId,
        academicYearId,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.log("[LESSONS_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
