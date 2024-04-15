"use client";

import { useSellers } from "@/hooks/queries/useSellers";
import { PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTable } from "../../../../components/table/data-table";
import { columns } from "./columns";

export function TableListSeller() {
  const router = useRouter();

  const [orderby, setOrderby] = useState("asc.cod");
  const [filters, setFilters] = useState();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const { data } = useSellers({
    page: pagination.pageIndex + 1,
    pagesize: pagination.pageSize,
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
    />
  );
}
