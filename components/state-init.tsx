"use client";

import { useAcademicYear } from "@/hooks/use-academic-year";
import { AcademicYear } from "@prisma/client";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  academicYear?: AcademicYear | null;
};

const StateInit = ({ children, academicYear }: Props) => {
  const { setActiveYear } = useAcademicYear();

  useEffect(() => {
    if (academicYear) {
      const yearStartDate = new Date(academicYear.yearStart);
      const yearEndDate = new Date(academicYear.yearEnd);

      setActiveYear({
        id: academicYear.id,
        label: `${yearStartDate.getFullYear()}/${yearEndDate.getFullYear()}`,
        yearStart: yearStartDate,
        yearEnd: yearEndDate,
      });
    }
  }, [academicYear, setActiveYear]);

  return <>{children}</>;
};

export default StateInit;
