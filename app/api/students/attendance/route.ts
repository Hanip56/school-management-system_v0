import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { getDaysInMonth } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await checkIsAdmin();
    const classId = req.nextUrl.searchParams.get("classId") || "";
    const date = req.nextUrl.searchParams.get("date") || "";
    const month = req.nextUrl.searchParams.get("month") || ""; // month in index, 0/1/2
    const year = req.nextUrl.searchParams.get("year") || ""; // eg, 2024

    if (!classId) return NextResponse.json({ data: [] }, { status: 200 });

    let whereAttendanceRecord: Prisma.AttendanceRecordWhereInput = {};

    if (date) {
      const targetDate = new Date(date);
      whereAttendanceRecord = {
        date: {
          gte: new Date(targetDate.setUTCHours(0, 0, 0, 0)),
          lte: new Date(targetDate.setUTCHours(23, 59, 59, 999)),
        },
      };
    } else if (month && year) {
      const startDate = new Date(`${year}-0${parseInt(month) + 1}-1`);
      const endDate = new Date(
        `${year}-0${parseInt(month) + 1}-${getDaysInMonth(startDate)}`
      );

      whereAttendanceRecord = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

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
          where: whereAttendanceRecord,
        },
      },
    });

    return NextResponse.json({
      data: students,
    });
  } catch (error) {
    console.log("[STUDENTS_STUDENTS-ATTENDANCE_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
