"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "@/lib/fetcher/lesson";
import { useNavigate } from "@/hooks/use-navigate";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import DataTableSkeleton from "@/components/skeletons/data-table-skeleton";
import { useAcademicYear } from "@/hooks/use-academic-year";
import UpsertLessonDialog from "./upsert-lesson-dialog";
import { Class, Subject, Teacher } from "@prisma/client";
import { format } from "date-fns";

type Props = {
  teachers: Teacher[];
  subjects: Subject[];
  classes: Class[];
};

const ClientComp = ({ classes, subjects, teachers }: Props) => {
  const { academicYear } = useAcademicYear();
  const [upsertOpenId, setUpsertOpenId] = useState("");
  const {
    page,
    handleNext,
    handlePrevious,
    search,
    handleSearch,
    updatedAt,
    toggleSortDate,
    limit,
    handleLimit,
  } = useNavigate();

  const query = useQuery({
    queryKey: ["lessons", { page, search, limit }],
    queryFn: () =>
      getAll({
        limit,
        page,
        search,
        updatedAt,
      }),
    placeholderData: (prev) => prev,
  });

  if (query.isLoading || query.isPending) return <DataTableSkeleton />;
  if (query.isError) return <h1>Error...</h1>;

  const lessons = query.data?.data;

  const initialData = upsertOpenId
    ? lessons.find((lesson) => lesson.id === upsertOpenId)
    : undefined;

  const dataTable = lessons.map((lesson) => ({
    id: lesson.id,
    class: lesson.class.name,
    teacher: `${lesson.teacher.firstName} ${lesson.teacher?.lastName}`,
    subject: lesson.subject.name,
    day: format(lesson.timeStart, "EEEE"),
    timeStart: format(lesson.timeStart, "HH:mm"),
    timeEnd: format(lesson.timeEnd, "HH:mm"),
  }));

  return (
    <>
      <UpsertLessonDialog
        open={!!upsertOpenId}
        handleClose={() => setUpsertOpenId("")}
        initialData={initialData}
        classes={classes}
        subjects={subjects}
        teachers={teachers}
      />
      <main>
        <div className="w-full py-3 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            value={search}
            onChange={handleSearch}
            className="w-full md:max-w-md"
            placeholder="Search lesson"
          />
          <div className="w-full justify-end md:justify-start md:w-fit flex gap-2 items-center">
            <Button variant="outline">Filter</Button>
            <Button variant="success" onClick={() => setUpsertOpenId("new")}>
              <PlusIcon className="size-5 mr-2" />{" "}
              <span className="line-clamp-1">Add lesson</span>
            </Button>
          </div>
        </div>

        {/* data-table */}
        <div className="my-4">
          <DataTable
            columns={columns(setUpsertOpenId)}
            data={dataTable}
            limit={limit}
            page={page}
            totalItems={query.data.total_items}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        </div>
      </main>
    </>
  );
};

export default ClientComp;
