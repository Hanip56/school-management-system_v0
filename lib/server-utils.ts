import { auth } from "@/auth";
import prisma from "./db";
import { NextResponse } from "next/server";

export const getCurrentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const getCurrentAcademicYear = async () => {
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      active: true,
    },
  });

  return academicYear;
};

export const checkIsAdmin = async () => {
  const user = await getCurrentUser();

  if (user?.role !== "ADMIN")
    return new NextResponse("Forbidden", { status: 403 });

  return user;
};
