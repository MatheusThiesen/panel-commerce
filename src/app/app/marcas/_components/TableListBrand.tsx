"use client";

import { useBrands } from "@/hooks/queries/useBrands";
import { PaginationState } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataTable } from "../../../../components/table/data-table";
import { columns } from "./columns";

export function TableListBrand() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderby = searchParams.get("orderby");
  const search = searchParams.get("search");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const { data, refetch, isLoading, isFetching } = useBrands({
    page: pagination.pageIndex + 1,
    pagesize: pagination.pageSize,
    orderby: orderby ?? "codigo.desc",
    search: search ?? undefined,
  });

  return (
    <DataTable
      columns={columns}
      data={
        data?.brands.map((brand) => ({
          id: String(brand.codigo),
          name: brand.descricao,
          minimalPrice: brand.valorPedidoMinimoFormat,
          isSale: brand.eVenda,
          isActive: brand.eAtivo,
        })) ?? []
      }
      total={data?.total ?? 0}
      pagination={pagination}
      setPagination={setPagination}
      onClickRow={(row) => router.push(`/app/marcas/${row.id}`)}
      onReload={refetch}
      orderby={{
        defaultValue: orderby ?? "codigo.desc",
        data: [
          { name: "Código (maiores primeiro)", value: "codigo.desc" },
          { name: "Código (menores primeiro)", value: "codigo.asc" },
          { name: "Nome (A-Z)", value: "descricao.asc" },
          { name: "Nome (Z-A)", value: "descricao.desc" },
        ],
      }}
      isLoading={isLoading || isFetching}
    />
  );
}
