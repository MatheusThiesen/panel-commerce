"use client";

import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { Alert, AlertTitle } from "../ui/alert";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableOrderbyProps } from "./data-tablet-orderby";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  total: number;

  onReload?: () => void;
  onClickRow?: (data: TData) => void;
  isLoading?: boolean;
  disableSearch?: boolean;

  orderby?: DataTableOrderbyProps;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  total,
  setPagination,
  pagination,
  onClickRow,
  onReload,
  orderby,
  isLoading,
  disableSearch = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / pagination.pageSize),
    onPaginationChange: (updater: any) => {
      const updated = updater(pagination);

      if (updated) {
        setPagination(updated);
      }
    },
  });

  return (
    <div className="space-y-4">
      <Suspense>
        <DataTableToolbar
          orderby={orderby}
          onReload={onReload}
          disableSearch={disableSearch}
        />
      </Suspense>
      <div className="rounded-md border relative">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute w-full z-10"
          >
            <Alert className="bg-green-100 text-green-600 z-10  w-full">
              <LoaderCircle className="animate-spin" color="rgba(22 163 74)" />
              <AlertTitle className="mt-[3.6px] ">
                Carregando dados da tabela
              </AlertTitle>
            </Alert>
          </motion.div>
        )}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
                  onClick={() => {
                    if (onClickRow) {
                      onClickRow(row.original);
                    }
                  }}
                  className={cn(onClickRow ? "cursor-pointer" : "")}
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
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
