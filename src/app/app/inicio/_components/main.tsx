"use client";

import {
  DetailContent,
  DetailHeader,
  DetailMain,
  DetailPage,
  DetailSubtitle,
  DetailTitle,
} from "@/components/layouts/detail";
import { ScreenLoading } from "@/components/loading-screen";
import { useAuth } from "@/hooks/useAuth";
import { Diamond, FolderLock, ShoppingBag, Store, Tag } from "lucide-react";
import { ListQuickAccess } from "./ListQuickAccess";

export function HomeMain() {
  const { user } = useAuth();

  if (!user) return <ScreenLoading />;

  return (
    <DetailPage>
      <DetailHeader>
        <DetailTitle className="capitalize">{`Olá, ${user?.name}`}</DetailTitle>
      </DetailHeader>

      <DetailMain>
        <DetailContent className="flex flex-col">
          <DetailSubtitle className="capitalize">Acesso rápido</DetailSubtitle>

          <ListQuickAccess
            data={[
              {
                icon: Store,
                title: "Visitar Loja",
                href: "https://app.alpardobrasil.com.br/",
                isExternal: true,
              },
              {
                icon: ShoppingBag,
                title: "Pedidos",
                href: "/app/pedidos",
              },
              {
                icon: Tag,
                title: "Produtos",
                href: "/app/produtos",
              },
              {
                icon: FolderLock,
                title: "Alçada desconto",
                href: "/app/regras/alcada-desconto",
              },
              {
                icon: Diamond,
                title: "Marcas",
                href: "/app/marcas",
              },
              {
                icon: FolderLock,
                title: "Mix de produtos",
                href: "/app/regras/mix-produtos",
              },
            ]}
          />
        </DetailContent>

        {/* <DetailContent className="flex flex-col mt-8">
          <DetailSubtitle className="capitalize">Pedidos</DetailSubtitle>
          <DetailBox></DetailBox>
        </DetailContent> */}
      </DetailMain>
    </DetailPage>
  );
}
