"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "@/lib/fetcher/student";
import { useNavigate } from "@/hooks/use-navigate";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import DataTableSkeleton from "@/components/skeletons/data-table-skeleton";
import { useAcademicYear } from "@/hooks/use-academic-year";
import UpsertStudentDialog from "./upsert-student-dialog";
import { Label } from "@/components/ui/label";
import { Class } from "@prisma/client";
import ExportButtons from "@/components/export-buttons";
import SelectWithLabel from "@/components/ui/select-with-label";
import usePushQuery from "@/hooks/use-push-query";
import qs from "query-string";
import { useSearchParams } from "next/navigation";
import BulkStudentButtons from "./bulk-student";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type Props = {
  classes: Class[];
};

export type SelectedId = {
  userId: string;
  studentId: string;
};

const ClientComp = ({ classes }: Props) => {
  const pushQuery = usePushQuery();
  const { academicYear } = useAcademicYear();

  const [upsertOpenId, setUpsertOpenId] = useState("");
  const [selectedIds, setSelectedIds] = useState<SelectedId[]>([]);

  const params = qs.parse(useSearchParams().toString());
  const classId = (params?.classId as string) ?? "";
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
    queryKey: ["students", { page, search, limit, classId, updatedAt }],
    queryFn: () =>
      getAll({
        limit,
        page,
        search,
        updatedAt,
        classId,
      }),
    placeholderData: (prev) => prev,
  });

  if (query.isLoading || query.isPending) return <DataTableSkeleton />;
  if (query.isError) return <h1>Error...</h1>;

  const students = query.data?.data;
  const assignedStudentIds = students
    .filter((student) =>
      student.classes.some((c) => c.academicYearId === academicYear?.id)
    )
    .map((student) => student.id);
  const unassignedStudentIds = students
    .filter(
      (student) =>
        !student.classes.some((c) => c.academicYearId === academicYear?.id)
    )
    .map((student) => student.id);

  const initialData = upsertOpenId
    ? students.find((student) => student.user.id === upsertOpenId)
    : undefined;

  const dataTable = students.map((student) => ({
    userId: student.user.id,
    studentId: student.id,
    username: student.user.username,
    gender: student.sex,
    phone: student.phone,
    email: student.user.email,
    currentClass:
      student.classes.find((c) => c.academicYearId === academicYear?.id)?.class
        ?.name ?? "-",
  }));

  return (
    <>
      <UpsertStudentDialog
        open={!!upsertOpenId}
        handleClose={() => setUpsertOpenId("")}
        initialData={initialData}
      />
      <main>
        <div className="w-full flex flex-wrap gap-x-4 gap-y-2 items-center">
          <div className="w-full md:max-w-xs space-y-1">
            <Label className="text-zinc-500 text-xs">Search Student</Label>
            <Input
              value={search}
              onChange={handleSearch}
              className="w-full bg-white"
              placeholder="Search student by name"
            />
          </div>
          <SelectWithLabel
            label="Class"
            value={classId ?? undefined}
            items={[
              { label: "All", value: "_" },
              { label: "Not Assigned", value: "none" },
              ...classes.map((c) => ({ label: c.name, value: c.id })),
            ]}
            onValueChange={(e) =>
              pushQuery({ classId: e !== "_" ? e : undefined })
            }
            placeholder="All"
          />
          <SelectWithLabel
            label="Limit"
            value={limit.toString()}
            items={[
              { label: "10", value: "10" },
              { label: "20", value: "20" },
              { label: "50", value: "50" },
            ]}
            onValueChange={(e) => handleLimit(+e)}
            placeholder="limit"
          />
          <SelectWithLabel
            label="Order"
            value={updatedAt}
            items={[
              { label: "Latest", value: "asc" },
              { label: "Newest", value: "desc" },
            ]}
            onValueChange={(e) => pushQuery({ updatedAt: e })}
            placeholder="desc"
          />
          <div className="w-fit space-y-1">
            <Label className="text-zinc-500 text-xs">Exports</Label>
            <ExportButtons data={dataTable} />
          </div>
        </div>

        {/* data-table */}
        <div className="my-4">
          <div>
            <div className="py-2 border-t flex flex-col sm:flex-row gap-2 items-center justify-between">
              <BulkStudentButtons
                assignedStudentIds={assignedStudentIds}
                unassignedStudentIds={unassignedStudentIds}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
              <Button
                size="sm"
                variant="success"
                onClick={() => setUpsertOpenId("new")}
              >
                <PlusIcon className="size-4 mr-2" />{" "}
                <span className="line-clamp-1">Add student</span>
              </Button>
            </div>
            <DataTable
              columns={columns({
                setUpsertOpenId,
                selectedIds,
                setSelectedIds,
              })}
              data={dataTable}
              limit={limit}
              page={page}
              totalItems={query.data.total_items}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default ClientComp;
