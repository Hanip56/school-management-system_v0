"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import UpsertStudentSheet from "./upsert-student-sheet";
import { PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "@/lib/fetcher/student";
import { useNavigate } from "@/hooks/use-navigate";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import DataTableSkeleton from "@/components/skeletons/data-table-skeleton";

const ClientComp = () => {
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
    queryKey: ["students", { page, search, limit }],
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

  const students = query.data?.data;

  const initialData = upsertOpenId
    ? students.find((student) => student.user.id === upsertOpenId)
    : undefined;

  const dataTable = students.map((student) => ({
    id: student.user.id,
    username: student.user.username,
    email: student.user.email,
  }));

  return (
    <>
      <UpsertStudentSheet
        open={!!upsertOpenId}
        handleClose={() => setUpsertOpenId("")}
        initialData={initialData}
      />
      <main>
        <div className="w-full py-3 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            value={search}
            onChange={handleSearch}
            className="w-full md:max-w-md"
            placeholder="Search student"
          />
          <div className="w-full justify-end md:justify-start md:w-fit flex gap-2 items-center">
            <Button variant="outline">Filter</Button>
            <Button variant="success" onClick={() => setUpsertOpenId("new")}>
              <PlusIcon className="size-5 mr-2" />{" "}
              <span className="line-clamp-1">Add student</span>
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
