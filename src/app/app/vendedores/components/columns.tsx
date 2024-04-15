"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  nickname: z.string(),
  email: z.string().optional(),
  isActive: z.boolean(),
});

export type Client = z.infer<typeof productSchema>;

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: "Código",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },

  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{row.getValue("name") ?? "-"}</span>
        <span className="text-xs font-light">{row.original.nickname}</span>
      </div>
    ),
  },

  {
    accessorKey: "email",
    header: "E-mail",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
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
