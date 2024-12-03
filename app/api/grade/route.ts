import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await checkIsAdmin();

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 1;
    const updatedAt = req.nextUrl.searchParams.get("updatedAt") || "desc";
    const search = req.nextUrl.searchParams.get("search") || "";
    const examIdParam = req.nextUrl.searchParams.get("examId") || undefined;
    let orderBy: Record<string, string> = {};

    if (typeof updatedAt === "string") {
      orderBy = {
        updatedAt,
      };
    }

    const where: Prisma.GradeWhereInput = {
      examId: examIdParam,
    };

    const total_items = await prisma.grade.count({
      where,
    });

    const grades = await prisma.grade.findMany({
      where,
      include: {
        exam: true,
      },
      take: limit,
      skip: limit * (page - 1),
      orderBy,
    });

    return NextResponse.json({
      data: grades,
      total_items,
    });
  } catch (error) {
    console.log("[GRADE_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await checkIsAdmin();

    const body = await req.json();

    const { name, examId, fromPercentage, toPercentage } = body;

    if (!name || !examId || !fromPercentage || !toPercentage) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const grade = await prisma.grade.create({
      data: {
        name,
        examId,
        fromPercentage,
        toPercentage,
      },
    });

    return NextResponse.json(grade);
  } catch (error) {
    console.log("[GRADE_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
