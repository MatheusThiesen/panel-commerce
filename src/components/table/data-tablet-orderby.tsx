"use client";

import { Label } from "@radix-ui/react-label";
import { ArrowUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export interface DataTableOrderbyProps {
  data: OrderbyItemProps[];
  defaultValue: string;
}

interface OrderbyItemProps {
  name: string;
  value: string;
}

export function DataTableOrderby({
  data,
  defaultValue,
}: DataTableOrderbyProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  function handleSetOrderby(value: string) {
    router.push(pathname + "?" + createQueryString("orderby", value));
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" type="button" size="sm" className="h-8">
          <ArrowUpDown className="size-4 md:mr-2" />
          <span className="hidden md:inline">Ordenar</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-background rounded-md border ">
        <RadioGroup
          defaultValue={defaultValue}
          className="text-sm"
          onValueChange={(e) => handleSetOrderby(e)}
        >
          {data.map((item) => (
            <div key={item.value} className="flex items-center space-x-2 ">
              <RadioGroupItem value={item.value} id={item.value} />
              <Label htmlFor={item.value}>{item.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
}
