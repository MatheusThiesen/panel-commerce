"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const brandSchema = z.object({
  id: z.string(),
  paymentCondition: z.string(),
  brand: z.string(),
  priceListCode: z.string(),
  localPayment: z.string(),
  minimalPrice: z.string(),
  isActive: z.boolean(),
  isOnlyDifferentiated: z.boolean(),
});

export type Brand = z.infer<typeof brandSchema>;

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: "brand",
    header: "Marca",
    cell: ({ row }) => <div className="">{row.getValue("brand")}</div>,
  },

  {
    accessorKey: "priceListCode",
    header: "Lista de preço",
    cell: ({ row }) => <div className="">{row.getValue("priceListCode")}</div>,
  },

  {
    accessorKey: "paymentCondition",
    header: "Condição pagamento",
    cell: ({ row }) => (
      <div className="">{row.getValue("paymentCondition")}</div>
    ),
  },
  {
    accessorKey: "localPayment",
    header: "Local de cobrança",
    cell: ({ row }) => <div className="">{row.getValue("localPayment")}</div>,
  },
  {
    accessorKey: "minimalPrice",
    header: "Valor mínimo",
    cell: ({ row }) => <div className="">{row.getValue("minimalPrice")}</div>,
  },
  {
    header: "Diferenciado",
    accessorKey: "isOnlyDifferentiated",
    cell: ({ row }) => (
      <div className="w-[30px]">
        {row.getValue("isOnlyDifferentiated") ? (
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
