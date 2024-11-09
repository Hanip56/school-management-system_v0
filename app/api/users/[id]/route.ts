import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    checkIsAdmin();

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    await prisma.user.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: `User with id:${user.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[USERS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
