"use client";

import { PaginationState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { DataTable } from "@/components/table/data-table";
import { useRulesConcepts } from "@/hooks/queries/useRulesConcepts";
import { columns } from "./columns";

export function TableListRulesConcept() {
  const searchParams = useSearchParams();

  const orderby = searchParams.get("orderby");
  const search = searchParams.get("search");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const { data, refetch, isLoading, isFetching } = useRulesConcepts({
    page: pagination.pageIndex + 1,
    pagesize: pagination.pageSize,
    orderby: orderby ?? "codigo.desc",
    search: search ?? "",
  });

  return (
    <DataTable
      columns={columns}
      data={
        data?.rules.map((rule) => ({
          id: rule.id,
          group: rule.subGrupo.grupo.descricao,
          subgroup: rule.subGrupo.descricao,
          concept: rule.conceito.descricao,
        })) ?? []
      }
      total={data?.total ?? 0}
      pagination={pagination}
      setPagination={setPagination}
      onReload={refetch}
      isLoading={isLoading || isFetching}
    />
  );
}
