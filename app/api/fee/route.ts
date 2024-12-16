import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 1;
    const updatedAt = req.nextUrl.searchParams.get("updatedAt") || "desc";
    const search = req.nextUrl.searchParams.get("search") || "";
    const classId = req.nextUrl.searchParams.get("classId") || undefined;
    let orderBy: Record<string, string> = {};

    if (typeof updatedAt === "string") {
      orderBy = {
        updatedAt,
      };
    }

    const where: Prisma.FeeStructureWhereInput = {
      classId,
    };

    const total_items = await prisma.feeStructure.count({
      where,
    });

    const feeCategories = await prisma.feeStructure.findMany({
      where,
      include: {
        category: true,
      },
      take: limit,
      skip: limit * (page - 1),
      orderBy,
    });

    return NextResponse.json({
      data: feeCategories,
      total_items,
    });
  } catch (error) {
    console.log("[FEE-CATEGORY_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { classId, categoryId, amount, dueDate } = body;

    if (!classId || !categoryId || !amount || !dueDate) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const feeStructure = await prisma.feeStructure.create({
      data: {
        classId,
        categoryId,
        amount,
      },
    });

    const students = await prisma.student.findMany({
      where: {
        classes: {
          some: { classId },
        },
      },
    });

    const invoices = await prisma.invoice.createMany({
      data: students.map((student) => ({
        studentId: student.id,
        amountDue: amount,
        originalAmount: amount,
        totalAmount: amount,
        dueDate,
        feeStructureId: feeStructure.id,
      })),
    });

    return NextResponse.json({ feeStructure, invoices });
  } catch (error) {
    console.log("[FEE-CATEGORY_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
