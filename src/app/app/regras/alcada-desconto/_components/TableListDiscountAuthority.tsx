"use client";

import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";

import { DataTable } from "@/components/table/data-table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DiscountAuthority,
  useDiscountAuthorities,
} from "@/hooks/queries/useDiscountAuthorities";
import { columns } from "./columns";
import { DiscountAuthorityChangeForm } from "./discountAuthorityChangeForm";

export function TableListDiscountAuthority() {
  const [selectedDiscountAuthority, setSelectedDiscountAuthority] =
    useState<DiscountAuthority>();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const { data, refetch, isLoading, isFetching } = useDiscountAuthorities({
    page: pagination.pageIndex + 1,
    pagesize: pagination.pageSize,
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={
          data?.discountAuthorities.map((discount) => ({
            id: discount.id,
            sellerType: discount.tipoUsuario,
            approval: `${discount.percentualAprovacao} %`,
            request: `${discount.percentualSolicitacao} %`,
            hierarchies: String(discount.hierarquia),
          })) ?? []
        }
        disableSearch
        total={data?.total ?? 0}
        pagination={pagination}
        setPagination={setPagination}
        onReload={refetch}
        isLoading={isLoading || isFetching}
        onClickRow={(row) => {
          const find = data?.discountAuthorities.find((f) => f.id === row.id);
          if (find) setSelectedDiscountAuthority(find);
        }}
      />

      <Sheet
        open={!!selectedDiscountAuthority}
        onOpenChange={(e) => {
          if (e === false) setSelectedDiscountAuthority(undefined);
        }}
      >
        <SheetContent className="flex flex-col justify-between items-start">
          <SheetHeader>
            <SheetTitle>Editar</SheetTitle>
          </SheetHeader>

          {selectedDiscountAuthority && (
            <DiscountAuthorityChangeForm
              discountAuthority={selectedDiscountAuthority}
              onClose={() => setSelectedDiscountAuthority(undefined)}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
