import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "../logo";
import { Sidebar } from "./sidebar";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMain({ className }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start py-4 border-l-red-600 border-l-[5px] h-full",
        className
      )}
    >
      <Link href="/app/inicio">
        <Logo className="w-36 ml-5" />
      </Link>

      <Sidebar />
    </div>
  );
}
