"use client";

import { Badge } from "@/components/ui/badge";
import { defaultNoImage } from "@/global/parameters";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  imagemPreview: z.string().optional(),
  reference: z.string(),
  description: z.string(),
  salePrice: z.string(),
  isActive: z.boolean(),
});

export type Product = z.infer<typeof taskSchema>;

export const columns: ColumnDef<Product>[] = [
  // {
  //   id: "id",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  // },
  {
    accessorKey: "imagemPreview",
    header: "Capa",
    cell: ({ row }) => {
      return (
        <div className="w-[60px]">
          <img
            // width={60}
            // height={60}
            className="object-contain w-16 h-16"
            src={
              row.getValue("imagemPreview")
                ? row.getValue("imagemPreview")
                : defaultNoImage
            }
            alt={row.getValue("description")}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = defaultNoImage;
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Código",
    cell: ({ row }) => <div className="w-[10px]">{row.getValue("id")}</div>,
  },
  {
    header: "Referência",
    accessorKey: "reference",
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("reference")}</div>
    ),
  },
  {
    header: "Nome",
    accessorKey: "description",
    cell: ({ row }) => (
      <div className="w-[20rem]">{row.getValue("description")}</div>
    ),
  },
  {
    header: "PDV",
    accessorKey: "salePrice",
    cell: ({ row }) => (
      <div className="w-[50px]">{row.getValue("salePrice")}</div>
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
