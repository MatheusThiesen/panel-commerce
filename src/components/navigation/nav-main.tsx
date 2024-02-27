import { ButtonTheme } from "@/components/button-theme";
import { Menu } from "lucide-react";
import { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { SidebarMain } from "./sidebar-main";
import { UserNav } from "./user-nav";

interface Props {
  children: ReactNode;
}

export function Navigation({ children }: Props) {
  return (
    <div className="ui-layout">
      <div className="ui-layout-sidebar border-r ">
        <SidebarMain />
      </div>

      <div className="ui-layout-navbar border-b">
        <div className="flex h-16 items-center px-4">
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
