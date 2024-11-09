import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma, UserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { username, email, password, role } = await req.json();

    if (!username || !email || !password) {
      return new NextResponse(
        "Required field is missing; *username *email *password",
        { status: 400 }
      );
    }

    const userExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userExist) {
      return new NextResponse("Email already in use", { status: 400 });
    }

    const hashPass = await bcrypt.hash(password, 10);

    let teacher: Prisma.TeacherCreateWithoutUserInput | undefined;
    let student: Prisma.StudentCreateWithoutUserInput | undefined;
    let userRole: UserRole = "ADMIN";

    if (role) {
      switch (role) {
        case "STUDENT":
          userRole = "STUDENT";
          student = {};
          break;
        case "TEACHER":
          userRole = "TEACHER";
          teacher = {};
          break;
        default:
          break;
      }
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPass,
        role: userRole,
        teacher: {
          create: teacher,
        },
        student: {
          create: student,
        },
      },
    });

    return NextResponse.json({ ...user, password: undefined });
  } catch (error) {
    console.log("[REGISTER_USER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
