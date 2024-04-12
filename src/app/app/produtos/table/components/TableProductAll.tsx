"use client";

import { useProducts } from "@/hooks/queries/useProducts";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";

export function TableProductAll() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data } = useProducts({
    page: pagination.pageIndex + 1,
    pagesize: pagination.pageSize,
  });

  return (
    <DataTable
      columns={columns}
      data={
        data?.products.map((product) => ({
          imagemPreview: product.imagemPreview,
          id: String(product.codigo),
          reference: product.referencia,
          description: product.descricao,
          salePrice: product.precoVendaFormat,
          isActive: product.eAtivo,
        })) ?? []
      }
      total={data?.total ?? 0}
      pagination={pagination}
      setPagination={setPagination}
      onClickRow={(row) => alert(row)}
    />
  );
}
