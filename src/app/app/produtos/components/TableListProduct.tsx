"use client";

import { useProducts } from "@/hooks/queries/useProducts";
import { PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTable } from "../../../../components/table/data-table";
import { columns } from "./columns";

export function TableListProduct() {
  const router = useRouter();

  const [orderby, setOrderby] = useState("asc.cod");
  const [filters, setFilters] = useState();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
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
      onClickRow={(row) => router.push(`/app/produtos/${row.id}`)}
    />
  );
}
