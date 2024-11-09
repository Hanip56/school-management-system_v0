"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  limit: number;
  page: number;
  handlePrevious: () => void;
  handleNext: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  limit,
  page,
  handleNext,
  handlePrevious,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-1 sm:gap-2 space-x-2 py-4">
        <p className="text-xs sm:text-sm text-slate-500">
          Menampilkan <span className="font-semibold">{data.length}</span> dari{" "}
          <span className="font-semibold">{totalItems}</span>
        </p>
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={page <= 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="text-sm text-muted-foreground px-3">
            {page}
            <small>{!totalPages ? "" : `/${totalPages}`}</small>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={totalItems <= page * limit}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
