"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const brandSchema = z.object({
  id: z.string(),
  sellerType: z.string(),
  approval: z.string(),
  request: z.string(),
  hierarchies: z.string(),
});

export type Brand = z.infer<typeof brandSchema>;

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: "sellerType",
    header: "Tipo",
    cell: ({ row }) => <div className="">{row.getValue("sellerType")}</div>,
  },

  {
    accessorKey: "approval",
    header: "Aprovação",
    cell: ({ row }) => (
      <div className="text-center w-[60px]">{row.getValue("approval")}</div>
    ),
  },

  {
    accessorKey: "request",
    header: "Solicitação",
    cell: ({ row }) => (
      <div className="text-center w-[60px]">{row.getValue("request")}</div>
    ),
  },

  {
    accessorKey: "hierarchies",
    header: "Hierarquia",
    cell: ({ row }) => (
      <div className=" text-center w-[60px]">{row.getValue("hierarchies")}</div>
    ),
  },
];
