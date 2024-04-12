import { ButtonTheme } from "@/components/button-theme";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { SidebarMain } from "./sidebar-main";
import { UserNav } from "./user-nav";

interface Breadcrumb {
  title: string;
  href: string;
}

interface Props {
  children: ReactNode;

  breadcrumbs?: Breadcrumb[];
}

export function Navigation({ children, breadcrumbs }: Props) {
  return (
    <div className="ui-layout">
      <div className="ui-layout-sidebar border-r ">
        <SidebarMain />
      </div>

      <div className="ui-layout-navbar border-b bg-background">
        <div className="flex h-16 items-center px-4">
          <div className="hidden md:flex ">
            {breadcrumbs?.map((breadcrumb, index) => (
              <div key={breadcrumb.href}>
                <Link
                  className="hover:underline text-sm"
                  href={breadcrumb.href}
                >
                  {breadcrumb.title}
                </Link>

                {breadcrumbs.length !== index + 1 && (
                  <span className="mx-2 text-red-500">/</span>
                )}
              </div>
            ))}
          </div>

          <Sheet>
            <SheetTrigger className="hidden max-md:flex cursor-pointer text-red-600 hover:text-red-600 ">
              <Menu className="size-7" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0">
              <SidebarMain />
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center space-x-4">
            <ButtonTheme />
            <UserNav />
          </div>
        </div>
      </div>

      <div className="ui-layout-content">{children}</div>
    </div>
  );
}
