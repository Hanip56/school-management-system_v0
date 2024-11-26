import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

// delete multiple
export async function POST(req: NextRequest) {
  try {
    await checkIsAdmin();

    const body = await req.json();
    const { ids } = body;

    if (!ids || ids.length < 1) {
      return new NextResponse("No content", { status: 204 });
    }

    const deleteRes = await prisma.user.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({ message: "Delete students sucessfully." });
  } catch (error) {
    console.log("[STUDENTS_DELETE-MULTIPLE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
