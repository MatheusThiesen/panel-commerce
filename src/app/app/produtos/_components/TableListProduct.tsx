"use client";

import { useProducts } from "@/hooks/queries/useProducts";
import { PaginationState } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataTable } from "../../../../components/table/data-table";
import { columns } from "./columns";
import { ProductFilterForm } from "./productFilterForm";

export function TableListProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderby = searchParams.get("orderby");
  const search = searchParams.get("search");
  const isImage = searchParams.get("isImage");
  const isSale = searchParams.get("isSale");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const { data, refetch, isLoading, isFetching } = useProducts({
    page: pagination.pageIndex + 1,
    pagesize: pagination.pageSize,
    orderby: orderby ?? "codigo.desc",
    search: search ?? "",
    filters: {
      isImage: isImage ?? "",
      isSale: isSale ?? "",
    },
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
      onReload={refetch}
      orderby={{
        defaultValue: orderby ?? "codigo.desc",
        data: [
          { name: "Código (maiores primeiro)", value: "codigo.desc" },
          { name: "Código (menores primeiro)", value: "codigo.asc" },
          { name: "Nome (A-Z)", value: "descricao.asc" },
          { name: "Nome (Z-A)", value: "descricao.desc" },
          { name: "PDV (maiores primeiro)", value: "precoVenda.desc" },
          { name: "PDV (menores primeiro)", value: "precoVenda.asc" },
        ],
      }}
      isLoading={isLoading || isFetching}
      formFilter={<ProductFilterForm />}
    />
  );
}
