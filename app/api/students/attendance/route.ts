import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { AttendanceStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await checkIsAdmin();
    const classId = req.nextUrl.searchParams.get("classId") || "";
    const date = req.nextUrl.searchParams.get("date") || "";

    if (!date || !classId)
      return NextResponse.json({ data: [] }, { status: 200 });

    const targetDate = new Date(date);

    const students = await prisma.student.findMany({
      where: {
        classes: {
          some: {
            classId,
          },
        },
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        attendanceRecords: {
          where: {
            date: {
              gte: new Date(targetDate.setUTCHours(0, 0, 0, 0)),
              lte: new Date(targetDate.setUTCHours(23, 59, 59, 999)),
            },
          },
        },
      },
    });

    console.log({ students });

    return NextResponse.json({
      data: students,
    });
  } catch (error) {
    console.log("[STUDENTS_STUDENTS-ATTENDANCE_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
