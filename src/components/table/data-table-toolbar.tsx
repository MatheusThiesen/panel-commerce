"use client";

import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { RotateCw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DataTableOrderby, DataTableOrderbyProps } from "./data-tablet-orderby";

interface DataTableToolbarProps<TData> {
  orderby?: DataTableOrderbyProps;
  onReload?: () => void;
  disableSearch?: boolean;
}

export function DataTableToolbar<TData>({
  orderby,
  onReload,
  disableSearch = false,
}: DataTableToolbarProps<TData>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get("search");
  const [searchState, setSearchState] = useState<string>(search ?? "");
  const debouncedSearch = useDebounce(searchState, 300);

  const isFiltered = (search?.length ?? 0) > 0;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleChangeSearch = useCallback(
    (value: string) => {
      router.push(pathname + "?" + createQueryString("search", value));
    },
    [router, pathname, createQueryString]
  );

  useEffect(() => {
    handleChangeSearch(debouncedSearch ?? "");
  }, [debouncedSearch, handleChangeSearch]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {onReload && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            type="button"
            onClick={onReload}
          >
            <RotateCw className="size-4" />
          </Button>
        )}

        {!disableSearch && (
          <Input
            placeholder="Buscar..."
            value={searchState}
            onChange={(event) => setSearchState(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => setSearchState("")}
            className="h-8 px-2 lg:px-3"
          >
            <span className="hidden md:inline">Limpar</span>

            <Cross2Icon className="size-4 md:ml-2" />
          </Button>
        )}

        {orderby && (
          <DataTableOrderby
            data={orderby.data}
            defaultValue={orderby.defaultValue}
          />
        )}

        {/* <Button variant="outline" size="sm" className="h-8">
          <ListFilter className="size-4 mr-2" />
          Filtros
        </Button> */}
      </div>
    </div>
  );
}
