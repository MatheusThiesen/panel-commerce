"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "../data/schema";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
  },
  {
    accessorKey: "Capa",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "Código",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "Referência",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "Nome",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "PDV",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "Situação",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("title")}</div>,
  },
];
