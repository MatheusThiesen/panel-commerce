"use client";

import { useSellers } from "@/hooks/queries/useSellers";
import { PaginationState } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataTable } from "../../../../components/table/data-table";
import { columns } from "./columns";

export function TableListSeller() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderby = searchParams.get("orderby");
  const search = searchParams.get("search");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const { data, isLoading, isFetching, refetch } = useSellers({
    page: pagination.pageIndex + 1,
    pagesize: pagination.pageSize,
    orderby: orderby ?? "codigo.desc",
    search: search ?? "",
  });

  return (
    <DataTable
      columns={columns}
      data={
        data?.sellers.map((client) => ({
          id: String(client.codigo),
          name: client.nome,
          nickname: client.nomeGuerra,
          email: client.email || "-",
          isActive: client.eAtivo,
        })) ?? []
      }
      total={data?.total ?? 0}
      pagination={pagination}
      setPagination={setPagination}
      onClickRow={(row) => router.push(`/app/vendedores/${row.id}`)}
      onReload={refetch}
      orderby={{
        defaultValue: orderby ?? "codigo.desc",
        data: [
          { name: "Código (maiores primeiro)", value: "codigo.desc" },
          { name: "Código (menores primeiro)", value: "codigo.asc" },
          { name: "Nome (A-Z)", value: "nome.asc" },
          { name: "Nome (Z-A)", value: "nome.desc" },
          { name: "Apelido (A-Z)", value: "nomeGuerra.asc" },
          { name: "Apelido (Z-A)", value: "nomeGuerra.desc" },
        ],
      }}
      isLoading={isLoading || isFetching}
    />
  );
}
