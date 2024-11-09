import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
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

    const total_items = await prisma.student.count({
      where: {
        user: {
          username: { contains: search as string, mode: "insensitive" },
        },
      },
    });

    const students = await prisma.student.findMany({
      where: {
        user: {
          username: { contains: search as string, mode: "insensitive" },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
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
