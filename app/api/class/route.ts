import prisma from "@/lib/db";
import {
  checkIsAdmin,
  getCurrentAcademicYear,
  getCurrentUser,
} from "@/lib/server-utils";
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

    let orderBy: Record<string, string> = {};

    if (typeof updatedAt === "string") {
      orderBy = {
        updatedAt,
      };
    }

    const where: Prisma.ClassWhereInput = {
      academicYearId: academicYear?.id,
    };

    const total_items = await prisma.class.count({ where });

    const classes = await prisma.class.findMany({
      where,
      take: limit,
      skip: limit * (page - 1),
      orderBy,
    });

    return NextResponse.json({
      data: classes,
      total_items,
    });
  } catch (error) {
    console.log("[CLASS_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

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
