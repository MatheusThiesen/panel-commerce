import { GroupInput } from "@/components/form/GroupInput";
import { InputBase } from "@/components/form/InputBase";
import { TextareaBase } from "@/components/form/TextareaBase";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductOne } from "@/hooks/queries/useProducts";
import { Trash2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

type Props = {
  params: { codigo: string };
};

export default async function HomePage({ params }: Props) {
  const product = await getProductOne(+params.codigo);

  if (product) {
    return (
      <Navigation
        breadcrumbs={[
          { href: "/app/inicio", title: "início" },
          { href: "/app/produtos", title: "produtos" },
          { href: `/app/produtos/${product.codigo}`, title: product.descricao },
        ]}
      >
        <DetailPage>
          <DetailHeader>
            <DetailGoBack />
            <DetailTitle>{product.descricao}</DetailTitle>
          </DetailHeader>

          <DetailMain>
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="stock">Estoques e variações</TabsTrigger>
                <TabsTrigger value="image">Imagens</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="pt-3">
                <DetailContent
                  secondaryColumn={
                    <>
                      <DetailBox className="flex-row">
                        <div className="flex justify-between items-center">
                          <Switch />
                          <span className="ml-2">Ativo</span>
                        </div>

                        <Button variant="outline">
                          <Trash2 />
                        </Button>
                      </DetailBox>

                      <DetailBox>
                        <DetailBoxTitle>Preço do produto</DetailBoxTitle>

                        <InputBase
                          name="pdv"
                          label="PDV"
                          value={product.precoVendaFormat}
                        />

                        <InputBase
                          name="cost"
                          label="Preço de custo"
                          value={product.precoVendaEmpresaFormat}
                        />
                      </DetailBox>

                      <DetailBox>
                        <DetailBoxTitle>Lista de preço</DetailBoxTitle>

                        {product.listaPreco?.map((list) => (
                          <InputBase
                            key={list.id}
                            name={list.descricao}
                            label={list.descricao}
                            value={list.valorFormat}
                          />
                        ))}
                      </DetailBox>
                    </>
                  }
                >
                  <DetailBox className="w-full">
                    <DetailBoxTitle>Cadastro</DetailBoxTitle>

                    <InputBase
                      name="code"
                      label="Código"
                      value={product.codigo}
                    />

                    <GroupInput>
                      <InputBase
                        name="reference"
                        label="Referência"
                        value={product.referencia}
                      />
                      <InputBase
                        name="groupCode"
                        label="Código agrupador"
                        value={product.codigoAlternativo}
                      />
                    </GroupInput>

                    <InputBase
                      name="ncm"
                      label="Ncm"
                      value={product.ncmFormat}
                    />

                    <InputBase
                      name="description"
                      label="Descrição"
                      value={product.descricao}
                    />

                    <InputBase
                      name="descriptionAdditional"
                      label="Informação adicional"
                      value={product.descricaoAdicional}
                    />

                    <TextareaBase
                      name="characteristics"
                      label="Características"
                      value={product.descricaoComplementar}
                    />
                  </DetailBox>
                </DetailContent>
              </TabsContent>
              <TabsContent value="stock" className="p-2">
                <DetailContent>
                  <DetailBox>
                    <DetailBoxTitle>Estoque</DetailBoxTitle>

                    <GroupInput>
                      <InputBase
                        name="packaging"
                        label="Acondicionamento"
                        value={product.qtdEmbalagem}
                      />
                      <InputBase
                        name="unitMeasure"
                        label="Unidade medida"
                        value={product.unidade?.unidade}
                      />
                    </GroupInput>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Local de estoque</TableHead>
                          <TableHead>Quantidade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.locaisEstoque?.map((stock) => (
                          <TableRow key={stock.id}>
                            <TableCell>{stock.descricao}</TableCell>
                            <TableCell>{stock.quantidade}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DetailBox>
                  <DetailBox>
                    <DetailBoxTitle>Variações</DetailBoxTitle>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Cor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.variacoes?.map((variation) => (
                          <TableRow key={variation.codigo}>
                            <TableCell>{variation.codigo}</TableCell>
                            <TableCell>
                              {variation.corPrimaria.descricao}
                              {variation.corSecundaria &&
                                " e " + variation.corSecundaria.cor.descricao}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DetailBox>
                </DetailContent>
              </TabsContent>
              <TabsContent value="image" className="p-2">
                image
              </TabsContent>
            </Tabs>
          </DetailMain>
        </DetailPage>
      </Navigation>
    );
  }
}
