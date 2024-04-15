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
import { Navigation } from "@/components/navigation/nav-main";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getSellerOne } from "@/hooks/queries/useSellers";
import { Trash2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendedores | Panel App Alpar do Brasil",
  description: "Pagina de detalhe do vendedor",
};

type Props = {
  params: { codigo: string };
};

export default async function HomePage({ params }: Props) {
  const seller = await getSellerOne(+params.codigo);

  if (seller) {
    return (
      <Navigation
        breadcrumbs={[
          { href: "/app/inicio", title: "início" },
          { href: "/app/vendedor", title: "vendedor" },
          { href: `/app/vendedor/${seller.codigo}`, title: seller.nomeGuerra },
        ]}
      >
        <DetailPage>
          <DetailHeader>
            <DetailGoBack />
            <DetailTitle>Detalhe do vendedor</DetailTitle>
          </DetailHeader>

          <DetailMain>
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
                  value={seller.nome}
                />

                <InputBase
                  name="cnpj"
                  label="Nome de guerra"
                  value={seller.nomeGuerra}
                />

                <InputBase name="cnpj" label="E-mail" value={seller.email} />
              </DetailBox>
            </DetailContent>
          </DetailMain>
        </DetailPage>
      </Navigation>
    );
  }
}
