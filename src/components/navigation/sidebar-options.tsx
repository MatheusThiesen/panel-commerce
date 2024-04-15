import { CircleUser, LucideIcon, ShoppingBag, Store, Tag } from "lucide-react";

export interface SidebarOptionProps {
  href: string;
  title: string;
  icon: LucideIcon;
  subpaths?: {
    href: string;
    title: string;
  }[];
}

export const sidebarOptions: SidebarOptionProps[] = [
  { title: "Produtos", icon: Tag, href: "/app/produtos" },
  { title: "Clientes", icon: Store, href: "/app/clientes" },
  { title: "Vendedores", icon: CircleUser, href: "/app/vendedores" },
  { title: "Pedidos", icon: ShoppingBag, href: "/app/pedidos" },
];
