import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ListQuickAccessProps {
  data: QuickAccess[];
}

type QuickAccess = {
  icon: LucideIcon;
  title: string;
  href: string;
  isExternal?: boolean;
};

export function ListQuickAccess({ data }: ListQuickAccessProps) {
  return (
    <div className="flex overflow-x-scroll w-full">
      <div className="flex gap-x-4">
        {data.map((item) => (
          <Button
            key={item.title}
            className="p-3 h-36 w-44 flex flex-col items-start justify-between hover:bg-background hover:border hover:border-red-600"
            variant="outline"
            asChild
          >
            <Link
              href={item.href}
              passHref
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              target={item.isExternal ? "_blank" : undefined}
            >
              <div className="bg-panel flex justify-center items-center p-2 rounded-lg">
                <item.icon size={16} />
              </div>

              <div className="w-full text-lg break-words">{item.title}</div>

              <div>
                <span className="text-red-600 hover:underline">Acessar</span>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
