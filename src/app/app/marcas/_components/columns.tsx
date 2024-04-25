"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const brandSchema = z.object({
  id: z.string(),
  name: z.string(),
  minimalPrice: z.string(),
  isSale: z.boolean(),
  isActive: z.boolean(),
});

export type Brand = z.infer<typeof brandSchema>;

export const columns: ColumnDef<Brand>[] = [
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
    accessorKey: "minimalPrice",
    header: "Preço mínimo",
    cell: ({ row }) => (
      <div className="w-[100px]">{row.getValue("minimalPrice")}</div>
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
