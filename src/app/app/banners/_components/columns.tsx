"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const brandSchema = z.object({
  id: z.string(),
  title: z.string(),
  brands: z.string(),
  qtdClicks: z.number(),
  isActive: z.boolean(),
});

export type Brand = z.infer<typeof brandSchema>;

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: "title",
    header: "Titulo",
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("title")}</div>,
  },

  {
    accessorKey: "qtdClicks",
    header: "Acessos",
    cell: ({ row }) => (
      <div className="w-[180px]">{row.getValue("qtdClicks")}</div>
    ),
  },

  {
    accessorKey: "brands",
    header: "Marcas",
    cell: ({ row }) => (
      <div className="w-[100px]">{row.getValue("brands")}</div>
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
