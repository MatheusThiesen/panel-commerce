"use client";

import { useOrders } from "@/hooks/queries/useOrders";
import { PaginationState } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataTable } from "../../../../components/table/data-table";
import { columns } from "./columns";

export function TableListOrder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderby = searchParams.get("orderby");
  const search = searchParams.get("search");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const { data, refetch, isLoading, isFetching } = useOrders({
    page: pagination.pageIndex + 1,
    pagesize: pagination.pageSize,
    orderby: orderby ?? "codigo.desc",
    search: search ?? "",
  });

  return (
    <DataTable
      columns={columns}
      data={
        data?.orders.map((order) => ({
          id: String(order.codigo),
          client: order.cliente.razaoSocial,
          seller:
            order.vendedores.find(({ tipo }) => tipo === 1)?.vendedor
              .nomeGuerra ?? "-",
          status: order.situacaoPedido.descricao,
          statusCode: order.situacaoPedido.codigo,
          itemsQtd: order.itens.length,
          totalAmount: order.valorTotalFormat,
          date: order.createdAtFormat,
        })) ?? []
      }
      total={data?.total ?? 0}
      pagination={pagination}
      setPagination={setPagination}
      onClickRow={(row) => router.push(`/app/pedidos/${row.id}`)}
      onReload={refetch}
      orderby={{
        defaultValue: orderby ?? "codigo.desc",
        data: [
          { name: "Código (maiores primeiro)", value: "codigo.desc" },
          { name: "Código (menores primeiro)", value: "codigo.asc" },
          { name: "Criado em (novos primeiro)", value: "createdAt.desc" },
          { name: "Criado em (antigos primeiro)", value: "createdAt.asc" },
        ],
      }}
      isLoading={isLoading || isFetching}
    />
  );
}
