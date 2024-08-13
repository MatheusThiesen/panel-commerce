"use client";

import { InputBase } from "@/components/form/InputBase";
import {
  DetailActionButton,
  DetailBox,
  DetailBoxTitle,
  DetailContent,
  DetailGoBack,
  DetailHeader,
  DetailMain,
  DetailPage,
  DetailTitle,
} from "@/components/layouts/detail";
import { ScreenLoading } from "@/components/loading-screen";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBrandOne } from "@/hooks/queries/useBrands";
import { Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BrandChangeForm } from "./brandChangeForm";
import { ListBlocksToBrand } from "./listBlocksToBrand";

interface BrandMainProps {
  brandCode: number;
}

export function BrandMain({ brandCode }: BrandMainProps) {
  const { data: brand, isLoading, isError } = useBrandOne(brandCode);
  const { push } = useRouter();

  useEffect(() => {
    if (isError) {
      push("/app/inicio");
    }
  }, [isError, push]);

  if (isLoading || !brand) return <ScreenLoading />;

  return (
    <DetailPage>
      <DetailHeader>
        <DetailGoBack />
        <DetailTitle>{brand.descricao}</DetailTitle>

        <Sheet>
          <SheetTrigger asChild>
            <DetailActionButton>
              <Pen className="mr-2 size-4" />
              Editar
            </DetailActionButton>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex flex-col justify-between items-start"
          >
            <SheetHeader className="mb-6">
              <SheetTitle>Editar</SheetTitle>
            </SheetHeader>

            <BrandChangeForm brand={brand} />
          </SheetContent>
        </Sheet>
      </DetailHeader>

      <DetailMain>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="block">Bloqueios</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="p-2">
            <DetailContent
              secondaryColumn={
                <>
                  <DetailBox className="flex-row">
                    <div className="flex justify-between items-center">
                      <Switch checked={!!brand.eAtivo} />
                      <span className="ml-2">Ativo</span>
                    </div>
                  </DetailBox>

                  <DetailBox className="flex-row">
                    <div className="flex justify-between items-center">
                      <Switch checked={!!brand.eVenda} />
                      <span className="ml-2">Venda</span>
                    </div>
                  </DetailBox>
                </>
              }
            >
              <DetailBox className="w-full">
                <DetailBoxTitle>Cadastro</DetailBoxTitle>

                <InputBase
                  name="code"
                  label="Código"
                  defaultValue={brand.codigo}
                  disabled
                  readOnly
                />

                <InputBase
                  name="name"
                  label="Nome"
                  defaultValue={brand.descricao}
                  readOnly
                />

                <InputBase
                  name="minimalPrice"
                  label="Preço mínimo por pedido"
                  defaultValue={brand.valorPedidoMinimoFormat}
                  readOnly
                />
              </DetailBox>
            </DetailContent>
          </TabsContent>
          <TabsContent value="block" className="p-2">
            <DetailContent>
              <ListBlocksToBrand brand={brand} />
            </DetailContent>
          </TabsContent>
        </Tabs>
      </DetailMain>
    </DetailPage>
  );
}
