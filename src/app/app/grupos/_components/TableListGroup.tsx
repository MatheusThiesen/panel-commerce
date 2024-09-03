"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Group, useGroups } from "@/hooks/queries/useGroups";
import { PaginationState } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataTable } from "../../../../components/table/data-table";
import { columns } from "./columns";
import { GroupChangeForm } from "./groupChangeForm";

export function TableListGroup() {
  const [selectedGroup, setSelectedGroup] = useState<Group>();

  const router = useRouter();
  const searchParams = useSearchParams();

  const orderby = searchParams.get("orderby");
  const search = searchParams.get("search");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const { data, refetch, isLoading, isFetching } = useGroups({
    page: pagination.pageIndex + 1,
    pagesize: pagination.pageSize,
    orderby: orderby ?? "codigo.desc",
    search: search ?? "",
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={
          data?.groups.map((group) => ({
            id: String(group.codigo),
            name: group.descricao,
            orderby: String(group.ornador ?? "-"),
            isSale: group.eVenda,
            isActive: group.eAtivo,
          })) ?? []
        }
        total={data?.total ?? 0}
        pagination={pagination}
        setPagination={setPagination}
        onClickRow={(row) => {
          const find = data?.groups.find(
            (f) => Number(f.codigo) === Number(row.id)
          );
          if (find) setSelectedGroup(find);
        }}
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

      <Sheet
        open={!!selectedGroup}
        onOpenChange={(e) => {
          if (e === false) setSelectedGroup(undefined);
        }}
      >
        <SheetContent className="flex flex-col justify-between items-start">
          <SheetHeader>
            <SheetTitle>Editar</SheetTitle>
          </SheetHeader>

          {selectedGroup && (
            <GroupChangeForm
              group={selectedGroup}
              onClose={() => setSelectedGroup(undefined)}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
