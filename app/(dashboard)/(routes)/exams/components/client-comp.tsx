"use client";

import qs from "query-string";

import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectWithLabel from "@/components/ui/select-with-label";
import { useNavigate } from "@/hooks/use-navigate";
import { Class } from "@prisma/client";
import usePushQuery from "@/hooks/use-push-query";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "@/lib/fetcher/exam";
import DataTableSkeleton from "@/components/skeletons/data-table-skeleton";
import { columns, ColumnType } from "./columns";
import ExportButtons from "@/components/export-buttons";
import UpsertExamDialog from "./upsert-exam-dialog";

type Props = {
  classes: Class[];
};

const ClientComp = ({ classes }: Props) => {
  const params = qs.parse(useSearchParams().toString());
  const pushQuery = usePushQuery();

  const [upsertOpenId, setUpsertOpenId] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
    queryKey: ["exams", { page, search, limit, classId, updatedAt }],
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

  const exams = query.data?.data;

  const dataTable: ColumnType[] = exams.map((exam) => ({
    id: exam.id,
    class: exam.class?.name,
    name: exam.name,
    description: exam.description,
  }));

  const initialData = upsertOpenId
    ? exams.find((student) => student.id === upsertOpenId)
    : undefined;

  return (
    <>
      <UpsertExamDialog
        open={!!upsertOpenId}
        handleClose={() => setUpsertOpenId("")}
        initialData={initialData}
        classes={classes}
      />
      <main>
        <div className="w-full flex flex-wrap gap-x-4 gap-y-2 items-center">
          <div className="w-full md:max-w-xs space-y-1">
            <Label className="text-zinc-500 text-xs">Search Exam</Label>
            <Input
              value={search}
              onChange={handleSearch}
              className="w-full bg-white"
              placeholder="Search exam by name"
            />
          </div>
          <SelectWithLabel
            label="Class"
            value={classId ?? undefined}
            items={[
              { label: "All", value: "_" },
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
              { label: "Oldest", value: "asc" },
              { label: "Latest", value: "desc" },
            ]}
            onValueChange={(e) => pushQuery({ updatedAt: e })}
            placeholder="desc"
          />
          <div className="w-fit space-y-1">
            <Label className="text-zinc-500 text-xs">Exports</Label>
            <ExportButtons data={dataTable} />
          </div>
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
                <span className="line-clamp-1">Add exam</span>
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
