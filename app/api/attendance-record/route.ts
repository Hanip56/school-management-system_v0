import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { AttendanceStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await checkIsAdmin();

    const body = await req.json();

    const { studentsData, classId, date } = body;

    if (!studentsData || !classId || !date)
      return new NextResponse("Required field is missing", { status: 400 });

    const targetDate = new Date(date);

    const updatedAttendanceRecords = await prisma.$transaction([
      prisma.attendanceRecord.deleteMany({
        where: {
          date: {
            gte: new Date(targetDate.setUTCHours(0, 0, 0, 0)),
            lte: new Date(targetDate.setUTCHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.attendanceRecord.createMany({
        data: (studentsData ?? []).map(
          ({ id, status }: { id: string; status: AttendanceStatus }) => ({
            classId,
            date,
            studentId: id,
            status,
          })
        ),
      }),
    ]);

    return NextResponse.json({ message: "Attendance updated successfully." });
  } catch (error) {
    console.log("[ATTENDANCE_RECORD_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
