import prisma from "@/lib/db";
import { checkIsAdmin, getCurrentAcademicYear } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

// delete multiple student-class
export async function POST(req: NextRequest) {
  try {
    await checkIsAdmin();

    const body = await req.json();
    const { ids } = body;
    const academicYear = await getCurrentAcademicYear();

    if (!ids || ids.length < 1) {
      return new NextResponse("No content", { status: 204 });
    }

    await prisma.studentClass.deleteMany({
      where: {
        studentId: {
          in: ids,
        },
        academicYearId: academicYear?.id,
      },
    });

    return NextResponse.json({ message: "Unassigned student sucessfully." });
  } catch (error) {
    console.log("[STUDENT-CLASS_DELETE-MULTIPLE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
