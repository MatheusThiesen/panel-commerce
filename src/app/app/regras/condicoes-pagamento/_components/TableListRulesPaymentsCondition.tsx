"use client";

import { PaginationState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { DataTable } from "@/components/table/data-table";
import { useRulesPaymentsCondition } from "@/hooks/queries/useRulesPaymentsCondition";
import { columns } from "./columns";

export function TableListRulesPaymentsCondition() {
  const searchParams = useSearchParams();

  const orderby = searchParams.get("orderby");
  const search = searchParams.get("search");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const { data, refetch, isLoading, isFetching } = useRulesPaymentsCondition({
    page: pagination.pageIndex + 1,
    pagesize: pagination.pageSize,
    orderby: orderby ?? "codigo.desc",
    search: search ?? undefined,
  });

  return (
    <DataTable
      columns={columns}
      data={
        data?.rules.map((rule) => ({
          id: rule.id,
          paymentCondition: rule.condicaoPagamento.descricao,
          brand: rule.marca.descricao,
          priceListCode: String(rule.listaPrecoCodigo),
          localPayment: rule.localCobranca.descricao,
          minimalPrice: rule.valorMinimoFormat,
          isActive: rule.eAtivo,
          isOnlyDifferentiated: rule.eApenasDiferenciado,
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
