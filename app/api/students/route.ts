import prisma from "@/lib/db";
import { checkIsAdmin, getCurrentAcademicYear } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await checkIsAdmin();

    const academicYear = await getCurrentAcademicYear();

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 1;
    const updatedAt = req.nextUrl.searchParams.get("updatedAt") || "desc";
    const search = req.nextUrl.searchParams.get("search") || "";
    const classIdParam = req.nextUrl.searchParams.get("classId") || "";

    let orderBy: Record<string, string> = {};

    let classIdFilterCondition: any;

    if (classIdParam === "none") {
      classIdFilterCondition = {
        none: {
          academicYearId: academicYear?.id,
        },
      };
    } else if (classIdParam) {
      classIdFilterCondition = {
        some: {
          classId: classIdParam,
          academicYearId: academicYear?.id,
        },
      };
    }

    if (typeof updatedAt === "string") {
      orderBy = {
        updatedAt,
      };
    }

    const where: Prisma.StudentWhereInput = {
      user: {
        username: { contains: search as string, mode: "insensitive" },
      },
      classes: classIdFilterCondition,
    };

    const total_items = await prisma.student.count({
      where,
    });

    const students = await prisma.student.findMany({
      where,
      include: {
        classes: {
          include: {
            class: true,
          },
        },
        user: {
          omit: {
            password: true,
          },
        },
      },
      take: limit,
      skip: limit * (page - 1),
      orderBy,
    });

    return NextResponse.json({
      data: students,
      total_items,
    });
  } catch (error) {
    console.log("[STUDENTS_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
