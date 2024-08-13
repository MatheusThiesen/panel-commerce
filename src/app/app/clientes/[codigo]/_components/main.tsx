"use client";

import { GroupInput } from "@/components/form/GroupInput";
import { InputBase } from "@/components/form/InputBase";
import { TextareaBase } from "@/components/form/TextareaBase";
import {
  DetailBox,
  DetailBoxSubtitle,
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
import { useClientOne } from "@/hooks/queries/useClients";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BlocksToClient } from "./blocksToClient";
import { SellersToClient } from "./sellersToClient";

interface ClientMainProps {
  clientCode: number;
}

export function ClientMain({ clientCode }: ClientMainProps) {
  const { data: client, isLoading, isError } = useClientOne(clientCode);
  const { push } = useRouter();

  useEffect(() => {
    if (isError) {
      push("/app/inicio");
    }
  }, [isError, push]);

  if (isLoading || !client) return <ScreenLoading />;

  return (
    <DetailPage>
      <DetailHeader>
        <DetailGoBack />
        <DetailTitle>{client.razaoSocial}</DetailTitle>
      </DetailHeader>

      <DetailMain>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="block">Bloqueios</TabsTrigger>
            <TabsTrigger value="sellers">Vendedores</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="p-2">
            <DetailContent
              secondaryColumn={
                <>
                  <DetailBox className="flex-row">
                    <div className="flex justify-between items-center">
                      <Switch checked={!!client.eAtivo} />
                      <span className="ml-2">Ativo</span>
                    </div>

                    <Button variant="outline">
                      <Trash2 />
                    </Button>
                  </DetailBox>

                  <DetailBox>
                    <DetailBoxTitle>Classificação</DetailBoxTitle>

                    <InputBase
                      name="activity-field"
                      label="Ramo de Atividade"
                      value={client.ramoAtividade?.descricao}
                    />

                    <InputBase
                      name="concept"
                      label="Conceito"
                      value={client.conceito?.descricao}
                    />
                  </DetailBox>

                  <DetailBox>
                    <DetailBoxTitle>Endereço</DetailBoxTitle>

                    <InputBase
                      name="zip-code"
                      label="CEP"
                      value={client.cepFormat}
                    />

                    <InputBase name="uf" label="UF" value={client.uf} />

                    <InputBase
                      name="city"
                      label="Cidade"
                      value={client.cidade}
                    />

                    <InputBase
                      name="address"
                      label="Endereço"
                      value={client.logradouro}
                    />

                    <InputBase
                      name="addressNumber"
                      label="Número"
                      value={client.numero}
                    />

                    <TextareaBase
                      name="complement"
                      label="Complemento"
                      value={client.complemento}
                    />
                  </DetailBox>
                </>
              }
            >
              <DetailBox className="w-full">
                <div>
                  <DetailBoxTitle>{client.razaoSocial}</DetailBoxTitle>
                  <DetailBoxSubtitle>{client.cnpjFormat}</DetailBoxSubtitle>
                </div>
              </DetailBox>

              <DetailBox className="w-full">
                <DetailBoxTitle>Cadastro</DetailBoxTitle>

                <InputBase name="code" label="Código" value={client.codigo} />

                <InputBase name="cnpj" label="CNPJ" value={client.cnpjFormat} />

                <InputBase
                  name="name"
                  label="Nome fantasia"
                  value={client.nomeFantasia}
                />

                <InputBase
                  name="socialReason"
                  label="Razão social"
                  value={client.razaoSocial}
                />

                <InputBase
                  name="stateRegistration"
                  label="Inscrição Estadual"
                  value={client.incricaoEstadual}
                />
              </DetailBox>

              <DetailBox className="w-full">
                <DetailBoxTitle>Contatos</DetailBoxTitle>

                <GroupInput>
                  <InputBase name="email" label="E-mail" value={client.email} />
                  <InputBase
                    name="email2"
                    label="E-mail 2"
                    value={client.email2}
                  />
                </GroupInput>

                <InputBase
                  name="cellPhone"
                  label="Celular"
                  value={client.celularFormat}
                />

                <GroupInput>
                  <InputBase
                    name="phone"
                    label="Telefone"
                    value={client.telefoneFormat}
                  />
                  <InputBase
                    name="phone2"
                    label="Telefone 2"
                    value={client.telefone2Format}
                  />
                </GroupInput>
              </DetailBox>

              <DetailBox className="w-full">
                <DetailBoxTitle>Observação</DetailBoxTitle>

                <TextareaBase name="obs" defaultValue={client.obs} readOnly />
              </DetailBox>
            </DetailContent>
          </TabsContent>
          <TabsContent value="block" className="p-2">
            <DetailContent>
              <BlocksToClient client={client} />
            </DetailContent>
          </TabsContent>
          <TabsContent value="sellers" className="p-2">
            <DetailContent>
              <SellersToClient client={client} />
            </DetailContent>
          </TabsContent>
        </Tabs>
      </DetailMain>
    </DetailPage>
  );
}
