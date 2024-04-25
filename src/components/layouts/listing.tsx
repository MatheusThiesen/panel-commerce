"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";
import { ClassNameValue } from "tailwind-merge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type ListingPageProps = {
  children: ReactNode;
};
export const ListingPage = ({ children }: ListingPageProps) => {
  return (
    <div className="flex flex-col items-center w-full px-8 py-5">
      <div className="flex flex-col w-full max-w-[var(--container-max-width)] pb-10">
        {children}
      </div>
    </div>
  );
};

type ListingHeaderProps = {
  children?: ReactNode;
  className?: ClassNameValue;
};
export const ListingHeader = ({ children, className }: ListingHeaderProps) => {
  return (
    <div className={cn("text-start mb-4 flex", className)}>{children}</div>
  );
};

type ListingTitle = {
  children?: ReactNode;
};
export const ListingTitle = ({ children }: ListingTitle) => {
  return <h2 className="text-2xl font-bold">{children}</h2>;
};

type ListingMainProps = {
  children?: ReactNode;
};
export const ListingMain = ({ children }: ListingMainProps) => {
  return <div className="bg-box rounded-lg">{children}</div>;
};

type ListingOptionsActionsProps = {
  data: {
    description: string;
    handle: () => void;
  }[];
};
export const ListingOptionsActions = ({ data }: ListingOptionsActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="p-5">
          Mais ações <ChevronDown className="ml-2 size-4 " />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mr-8 ">
        {data.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.description}
            className="text-center p-2 "
            onClick={() => item.handle()}
          >
            {item.description}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
