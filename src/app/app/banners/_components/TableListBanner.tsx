"use client";

import { useBanners } from "@/hooks/queries/useBanners";
import { PaginationState } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataTable } from "../../../../components/table/data-table";
import { columns } from "./columns";

export function TableListBanner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderby = searchParams.get("orderby");
  const search = searchParams.get("search");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const { data, refetch, isLoading, isFetching } = useBanners({
    page: pagination.pageIndex + 1,
    pagesize: pagination.pageSize,
    orderby: orderby ?? "createdAt.desc",
    search: search ?? "",
  });

  return (
    <DataTable
      columns={columns}
      data={
        data?.banners.map((banner) => ({
          id: banner.id,
          title: banner.titulo,
          brands: banner.marcas.map((item) => item.descricao).join(", "),
          qtdClicks: banner.qtdClicks,
          isActive: banner.eAtivo,
        })) ?? []
      }
      total={data?.total ?? 0}
      pagination={pagination}
      setPagination={setPagination}
      onClickRow={(row) => router.push(`/app/banners/${row.id}`)}
      onReload={refetch}
      isLoading={isLoading || isFetching}
    />
  );
}
