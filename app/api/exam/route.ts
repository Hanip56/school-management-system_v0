import prisma from "@/lib/db";
import { checkIsAdmin, getCurrentAcademicYear } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await checkIsAdmin();

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 1;
    const updatedAt = req.nextUrl.searchParams.get("updatedAt") || "desc";
    const search = req.nextUrl.searchParams.get("search") || "";
    const classIdParam = req.nextUrl.searchParams.get("classId") || undefined;
    let orderBy: Record<string, string> = {};

    if (typeof updatedAt === "string") {
      orderBy = {
        updatedAt,
      };
    }

    const where: Prisma.ExamWhereInput = {
      name: { contains: search as string, mode: "insensitive" },
      classId: classIdParam,
    };

    const total_items = await prisma.exam.count({
      where,
    });

    const exams = await prisma.exam.findMany({
      where,
      include: {
        class: true,
      },
      take: limit,
      skip: limit * (page - 1),
      orderBy,
    });

    return NextResponse.json({
      data: exams,
      total_items,
    });
  } catch (error) {
    console.log("[EXAM_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await checkIsAdmin();

    const academicYear = await getCurrentAcademicYear();

    const body = await req.json();

    const { name, classId, description } = body;

    if (!name) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        classId: classId !== "" ? classId : undefined,
        description,
        academicYearId: academicYear?.id ?? "",
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.log("[EXAM_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
