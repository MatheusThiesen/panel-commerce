"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  cpnj: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  isActive: z.boolean(),
});

export type Client = z.infer<typeof productSchema>;

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: "Código",
    cell: ({ row }) => <div className="w-[10px]">{row.getValue("id")}</div>,
  },

  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <div className="w-[300px] flex flex-col">
        <span className="text-sm">{row.getValue("name") ?? "-"}</span>
        <span className="text-xs font-light">{row.original.cpnj}</span>
      </div>
    ),
  },

  {
    accessorKey: "phone",
    header: "Contato",
    cell: ({ row }) => (
      <div className="w-[120px] flex flex-col">
        <span className="text-sm">{row.getValue("phone") ?? "-"}</span>
        <span className="text-xs font-light">{row.original.email}</span>
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
