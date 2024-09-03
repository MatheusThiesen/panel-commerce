"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  orderby: z.string(),
  isSale: z.boolean(),
  isActive: z.boolean(),
});

export type Group = z.infer<typeof groupSchema>;

export const columns: ColumnDef<Group>[] = [
  {
    accessorKey: "id",
    header: "Código",
    cell: ({ row }) => <div className="w-[8px]">{row.getValue("id")}</div>,
  },

  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("name")}</div>,
  },

  {
    accessorKey: "orderby",
    header: "Ordenador",
    cell: ({ row }) => (
      <div className="w-[180px]">{row.getValue("orderby")}</div>
    ),
  },

  {
    header: "Venda",
    accessorKey: "isSale",
    cell: ({ row }) => (
      <div className="w-[30px]">
        {row.getValue("isSale") ? (
          <Badge variant="outline" className="text-green-500">
            Sim
          </Badge>
        ) : (
          <Badge variant="outline" className="text-red-500">
            Não
          </Badge>
        )}
      </div>
    ),
  },
  {
    header: "Situação",
    accessorKey: "isActive",
    cell: ({ row }) => (
      <div className="w-[30px]">
        {row.getValue("isActive") ? (
          <Badge variant="outline" className="text-green-500">
            Ativo
          </Badge>
        ) : (
          <Badge variant="outline" className="text-red-500">
            Inativo
          </Badge>
        )}
      </div>
    ),
  },
];
