"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const brandSchema = z.object({
  id: z.string(),
  group: z.string(),
  subgroup: z.string(),
  concept: z.string(),
});

export type Brand = z.infer<typeof brandSchema>;

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: "concept",
    header: "Conceito",
    cell: ({ row }) => <div className="">{row.getValue("concept")}</div>,
  },

  {
    accessorKey: "group",
    header: "Grupo",
    cell: ({ row }) => <div className="">{row.getValue("group")}</div>,
  },

  {
    accessorKey: "subgroup",
    header: "Subgrupo",
    cell: ({ row }) => <div className="">{row.getValue("subgroup")}</div>,
  },
];
