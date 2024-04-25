"use client";

import { useClients } from "@/hooks/queries/useClients";
import { PaginationState } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataTable } from "../../../../components/table/data-table";
import { columns } from "./columns";

export function TableListClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderby = searchParams.get("orderby");
  const search = searchParams.get("search");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const { data, refetch, isLoading, isFetching } = useClients({
    page: pagination.pageIndex + 1,
    pagesize: pagination.pageSize,
    orderby: orderby ?? "codigo.desc",
    search: search ?? undefined,
  });

  return (
    <DataTable
      columns={columns}
      data={
        data?.clients.map((client) => ({
          id: String(client.codigo),
          name: client.razaoSocial,
          cpnj: client.cnpjFormat,
          phone: client.telefoneFormat,
          email: client.email,
          isActive: client.eAtivo,
        })) ?? []
      }
      total={data?.total ?? 0}
      pagination={pagination}
      setPagination={setPagination}
      onClickRow={(row) => router.push(`/app/clientes/${row.id}`)}
      onReload={refetch}
      orderby={{
        defaultValue: orderby ?? "codigo.desc",
        data: [
          { name: "Código (maiores primeiro)", value: "codigo.desc" },
          { name: "Código (menores primeiro)", value: "codigo.asc" },
          { name: "Nome (A-Z)", value: "razaoSocial.asc" },
          { name: "Nome (Z-A)", value: "razaoSocial.desc" },
          { name: "Criado em (novos primeiro)", value: "createdAt.desc" },
          { name: "Criado em (antigos primeiro)", value: "createdAt.asc" },
        ],
      }}
      isLoading={isLoading || isFetching}
    />
  );
}
