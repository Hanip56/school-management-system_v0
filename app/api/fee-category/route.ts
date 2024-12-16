import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
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

    const where: Prisma.FeeCategoryWhereInput = {
      name: { contains: search as string, mode: "insensitive" },
    };

    const total_items = await prisma.feeCategory.count({
      where,
    });

    const feeCategories = await prisma.feeCategory.findMany({
      where,
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
    await checkIsAdmin();

    const body = await req.json();

    const { name, type } = body;

    if (!name) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const feeCategory = await prisma.feeCategory.create({
      data: {
        name,
        type: type ?? undefined,
      },
    });

    return NextResponse.json(feeCategory);
  } catch (error) {
    console.log("[FEE-CATEGORY_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
