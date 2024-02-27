"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { SidebarOptionProps } from "./sidebar-options";

interface Props {
  data: SidebarOptionProps;
}

export function SidebarOption({ data }: Props) {
  const asHref = usePathname();
  const [isActiveLink, setIsActiveLink] = useState(false);

  useEffect(() => {
    if (asHref.startsWith("/" + String(data.href))) {
      return setIsActiveLink(true);
    }

    if (!asHref.startsWith(String("/" + data.href)) && isActiveLink) {
      setIsActiveLink(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asHref]);

  return (
    <Button
      asChild
      variant={isActiveLink ? "secondary" : "ghost"}
      className="w-full text-md justify-start"
      type="button"
    >
      <Link href={data.href}>
        <data.icon
          className={cn("mr-2 size-5")}
          fill="#e51c29"
          fillOpacity={isActiveLink ? 1 : 0}
        />
        {data.title}
      </Link>
    </Button>
  );
}
