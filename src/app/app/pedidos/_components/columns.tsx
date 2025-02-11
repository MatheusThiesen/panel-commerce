"use client";

import { Badge } from "@/components/ui/badge";
import { orderStatusStyle } from "@/hooks/queries/useOrders";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const orderSchema = z.object({
  id: z.string(),
  date: z.string(),
  client: z.string(),
  seller: z.string(),
  statusCode: z.number().optional(),
  status: z.string(),
  itemsQtd: z.number(),
  totalAmount: z.string(),
});

export type Order = z.infer<typeof orderSchema>;

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Pedido",
    cell: ({ row }) => <div>#{row.getValue("id")}</div>,
  },

  {
    accessorKey: "date",
    header: "Criado em",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("date")}</div>,
  },

  {
    accessorKey: "client",
    header: "Cliente",
    cell: ({ row }) => (
      <div className="w-[160px]">{row.getValue("client")}</div>
    ),
  },

  {
    accessorKey: "seller",
    header: "Vendedor",
    cell: ({ row }) => <div>{row.getValue("seller")}</div>,
  },

  {
    header: "Situação",
    accessorKey: "status",
    cell: ({ row }) => (
      <div className="w-[80px]">
        <Badge
          variant="outline"
          className={cn(
            orderStatusStyle?.[(row.original.statusCode ?? 1) as 1]?.bgColor,
            "text-white rounded-sm hover:bg"
          )}
        >
          {row.getValue("status")}
        </Badge>
      </div>
    ),
  },

  {
    accessorKey: "itemsQtd",
    header: "Itens",
    cell: ({ row }) => (
      <div className="w-[60px]">{row.getValue("itemsQtd")} itens</div>
    ),
  },

  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => (
      <div
        className={cn(
          orderStatusStyle?.[(row.original.statusCode ?? 1) as 1]?.textColor,
          "font-normal"
        )}
      >
        {row.getValue("totalAmount")}
      </div>
    ),
  },
];
