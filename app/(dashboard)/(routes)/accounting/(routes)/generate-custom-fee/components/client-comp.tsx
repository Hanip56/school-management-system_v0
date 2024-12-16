"use client";

import DataTableSkeleton from "@/components/skeletons/data-table-skeleton";
import { DataTable } from "@/components/ui/data-table";
import SelectWithLabel from "@/components/ui/select-with-label";
import { useNavigate } from "@/hooks/use-navigate";
import usePushQuery from "@/hooks/use-push-query";
import { getAll } from "@/lib/fetcher/fee";
import { Class, FeeCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import UpsertFeeDialog from "./upsert-fee-dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type Props = {
  classes: Class[];
  feeCategories: FeeCategory[];
};

const ClientComp = ({ classes, feeCategories }: Props) => {
  const pushQuery = usePushQuery();
  const params = qs.parse(useSearchParams().toString());
  const [upsertOpenId, setUpsertOpenId] = useState("");

  useEffect(() => {
    if (classes?.[0]) {
      pushQuery({ classId: classes?.[0].id });
    }
  }, []);

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
    queryKey: ["fees", { page, search, limit, classId, updatedAt }],
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

  const fees = query.data?.data;

  const initialData = upsertOpenId
    ? fees.find((fee) => fee.id === upsertOpenId)
    : undefined;

  const dataTable = fees.map((fee) => ({
    id: fee.id,
    category: fee.category.name,
    amount: fee.amount.toString(),
  }));

  return (
    <>
      <UpsertFeeDialog
        open={!!upsertOpenId}
        fees={fees}
        classes={classes}
        categories={feeCategories}
        handleClose={() => setUpsertOpenId("")}
        initialData={initialData}
      />
      <main>
        <div className="w-full flex flex-wrap gap-x-4 gap-y-2 items-center">
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
                <span className="line-clamp-1">Add fee</span>
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
