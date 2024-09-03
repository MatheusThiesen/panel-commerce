import {
  Boxes,
  CircleUser,
  Diamond,
  FolderLock,
  LucideIcon,
  Presentation,
  ShoppingBag,
  Store,
  Tag,
} from "lucide-react";

export interface SidebarOptionProps {
  href: string;
  title: string;
  icon: LucideIcon;
  subpaths?: {
    href: string;
    title: string;
    exact?: boolean;
  }[];
}

export const sidebarOptions: SidebarOptionProps[] = [
  { title: "Produtos", icon: Tag, href: "/app/produtos" },
  {
    title: "Clientes",
    icon: Store,
    href: "/app/clientes",
  },
  { title: "Vendedores", icon: CircleUser, href: "/app/vendedores" },
  { title: "Pedidos", icon: ShoppingBag, href: "/app/pedidos" },
  {
    title: "Marcas",
    icon: Diamond,
    href: "/app/marcas",
  },
  {
    title: "Grupo",
    icon: Boxes,
    href: "/app/grupos",
  },
  {
    title: "Banner",
    icon: Presentation,
    href: "/app/banners",
  },
  {
    title: "Regras",
    icon: FolderLock,
    href: "/app/regras/condicoes-pagamento",
    subpaths: [
      {
        title: "Condições pagamento",
        href: "/app/regras/condicoes-pagamento",
        exact: true,
      },
      {
        title: "Mix de produtos",
        href: "/app/regras/mix-produtos",
        exact: true,
      },
      {
        title: "Alçada desconto",
        href: "/app/regras/alcada-desconto",
        exact: true,
      },
    ],
  },
];
