"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { SidebarOptionProps } from "./sidebar-options";

interface Props {
  data: SidebarOptionProps;
}

export function SidebarOption({ data }: Props) {
  const asHref = usePathname();
  // const [isActiveLink, setIsActiveLink] = useState(false);

  const isActiveLink = asHref.startsWith(
    String(data.href)
      .split("/")
      .filter((_, index) => index <= 2)
      .join("/")
  );

  // useEffect(() => {
  //   if (asHref.startsWith(String(data.href))) {
  //     return setIsActiveLink(true);
  //   }

  //   if (!asHref.startsWith(String(data.href)) && isActiveLink) {
  //     setIsActiveLink(false);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [asHref]);

  return (
    <div className="w-full flex flex-col">
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

      {isActiveLink &&
        data.subpaths &&
        data?.subpaths?.length > 0 &&
        data.subpaths.map((subpath) => (
          <Button
            key={subpath.href}
            asChild
            variant={isActiveLink ? "link" : "link"}
            className={cn(
              "w-full text-md justify-start text-sm ml-7",
              !!subpath?.exact
                ? asHref === subpath.href
                  ? "text-red-600"
                  : undefined
                : asHref.startsWith(String(subpath.href))
                ? "text-red-600"
                : undefined
            )}
            type="button"
          >
            <Link href={subpath.href}>{subpath.title}</Link>
          </Button>
        ))}
    </div>
  );
}
