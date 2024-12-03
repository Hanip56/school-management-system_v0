"use client";

import DataTableSkeleton from "@/components/skeletons/data-table-skeleton";
import { DataTable } from "@/components/ui/data-table";
import SelectWithLabel from "@/components/ui/select-with-label";
import { useNavigate } from "@/hooks/use-navigate";
import usePushQuery from "@/hooks/use-push-query";
import { getAll } from "@/lib/fetcher/grade";
import { Exam } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import UpsertGradeDialog from "./upsert-grade-dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type Props = {
  exams: Exam[];
};

const ClientComp = ({ exams }: Props) => {
  const pushQuery = usePushQuery();
  const params = qs.parse(useSearchParams().toString());
  const [upsertOpenId, setUpsertOpenId] = useState("");

  useEffect(() => {
    if (exams?.[0]) {
      pushQuery({ examId: exams?.[0].id });
    }
  }, []);

  const examId = (params?.examId as string) ?? "";
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
    queryKey: ["grades", { page, search, limit, examId, updatedAt }],
    queryFn: () =>
      getAll({
        limit,
        page,
        search,
        updatedAt,
        examId,
      }),
    placeholderData: (prev) => prev,
  });

  if (query.isLoading || query.isPending) return <DataTableSkeleton />;
  if (query.isError) return <h1>Error...</h1>;

  const grades = query.data?.data;

  const initialData = upsertOpenId
    ? grades.find((grade) => grade.id === upsertOpenId)
    : undefined;

  const dataTable = grades.map((grade) => ({
    id: grade.id,
    exam: grade.exam.name,
    name: grade.name,
    from: grade.fromPercentage,
    to: grade.toPercentage,
  }));

  return (
    <>
      <UpsertGradeDialog
        open={!!upsertOpenId}
        exams={exams}
        handleClose={() => setUpsertOpenId("")}
        initialData={initialData}
      />
      <main>
        <div className="w-full flex flex-wrap gap-x-4 gap-y-2 items-center">
          <SelectWithLabel
            label="Exam"
            value={examId ?? undefined}
            items={[...exams.map((c) => ({ label: c.name, value: c.id }))]}
            onValueChange={(e) =>
              pushQuery({ examId: e !== "_" ? e : undefined })
            }
            placeholder="Select exam"
          />
        </div>

        <div className="my-4">
          <div>
            <div className="py-2 border-t flex flex-col sm:flex-row gap-2 items-center justify-end">
              <Button
                size="sm"
                variant="success"
                onClick={() => setUpsertOpenId("new")}
              >
                <PlusIcon className="size-4 mr-2" />{" "}
                <span className="line-clamp-1">Add grade</span>
              </Button>
            </div>
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
        </div>
      </main>
    </>
  );
};

export default ClientComp;
