import { auth } from "@/auth";
import prisma from "./db";

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
