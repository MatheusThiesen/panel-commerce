"use client";

import { InputBase } from "@/components/form/InputBase";
import {
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSellerOne } from "@/hooks/queries/useSellers";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BlocksToSeller } from "./blocksToSeller";

interface SellerMainProps {
  sellerCode: number;
}

export function SellerMain({ sellerCode }: SellerMainProps) {
  const { data: seller, isLoading, isError } = useSellerOne(sellerCode);
  const { push } = useRouter();

  useEffect(() => {
    if (isError) {
      push("/app/inicio");
    }
  }, [isError]);

  if (isLoading || !seller) return <ScreenLoading />;

  return (
    <DetailPage>
      <DetailHeader>
        <DetailGoBack />
        <DetailTitle>Detalhe do vendedor</DetailTitle>
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
                      <Switch checked={!!seller.eAtivo} />
                      <span className="ml-2">Ativo</span>
                    </div>

                    <Button variant="outline">
                      <Trash2 />
                    </Button>
                  </DetailBox>

                  <DetailBox>
                    <DetailBoxTitle>Tipo</DetailBoxTitle>

                    <InputBase name="type" value={seller.tipoVendedor} />
                  </DetailBox>

                  <DetailBox>
                    <DetailBoxTitle>Hierarquia</DetailBoxTitle>

                    <InputBase
                      name="directorCod"
                      label="Cód. Diretor"
                      value={seller.codDiretor}
                    />

                    <InputBase
                      name="managerCod"
                      label="Cód. Gerente"
                      value={seller.codGerente}
                    />

                    <InputBase
                      name="supervisor-cod"
                      label="Cód. Supervisor"
                      value={seller.codSupervisor}
                    />
                  </DetailBox>
                </>
              }
            >
              <DetailBox className="w-full">
                <DetailBoxTitle>Cadastro</DetailBoxTitle>

                <InputBase
                  name="code"
                  label="Nome completo"
                  value={seller.codigo}
                />

                <InputBase
                  name="name"
                  label="Nome completo"
                  value={seller.nome}
                />

                <InputBase
                  name="nickname"
                  label="Apelido"
                  value={seller.nomeGuerra}
                />

                <InputBase name="email" label="E-mail" value={seller.email} />

                <InputBase
                  name="brands"
                  label="Marcas"
                  value={seller?.marcas?.map((item) => item.descricao).join()}
                />
              </DetailBox>
            </DetailContent>
          </TabsContent>
          <TabsContent value="block" className="p-2">
            <DetailContent>
              <BlocksToSeller seller={seller} />
            </DetailContent>
          </TabsContent>
        </Tabs>
      </DetailMain>
    </DetailPage>
  );
}
