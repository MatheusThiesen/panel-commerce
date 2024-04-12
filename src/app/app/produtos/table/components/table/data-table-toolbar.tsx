"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, ListFilter, RotateCw } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Button variant="outline" size="sm" className="h-8">
          <RotateCw className="size-4" />
        </Button>
        <Input
          placeholder="Buscar..."
          value={
            (table.getColumn("reference")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("reference")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Button variant="outline" size="sm" className="h-8">
          <ArrowUpDown className="size-4 mr-2" />
          Ordenar
        </Button>
        <Button variant="outline" size="sm" className="h-8">
          <ListFilter className="size-4 mr-2" />
          Filtros
        </Button>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
