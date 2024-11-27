import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

// create multiple // bulk assign student to class
export async function POST(req: NextRequest) {
  try {
    await checkIsAdmin();

    const body = await req.json();
    const { studentIds, classId, academicYearId } = body;

    if (studentIds?.length < 1 || !classId || !academicYearId) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    // create many
    const studentClasses = await prisma.studentClass.createMany({
      data: studentIds.map((studentId: string) => ({
        academicYearId,
        classId,
        studentId,
      })),
    });

    return NextResponse.json({ message: "Assign students sucessfully." });
  } catch (error) {
    console.log("[STUDENT-CLASS_CREATE_MULTIPLE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
