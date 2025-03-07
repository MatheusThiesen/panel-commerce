"use client";

import { ImageWithFallback } from "@/components/ImageWithFallback";
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
import { ScreenLoading } from "@/components/loading-screen";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { spaceImages } from "@/global/parameters";
import { useProductOne } from "@/hooks/queries/useProducts";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProductMainProps {
  productCode: number;
}

export function ProductMain({ productCode }: ProductMainProps) {
  const { data: product, isLoading, isError } = useProductOne(productCode);
  const { push } = useRouter();

  useEffect(() => {
    if (isError) {
      push("/app/inicio");
    }
  }, [isError, push]);

  if (isLoading || !product) return <ScreenLoading />;

  return (
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
          <TabsContent value="general" className="pt-2">
            <DetailContent
              secondaryColumn={
                <>
                  <DetailBox className="flex-row">
                    <div className="flex justify-between items-center">
                      <Switch checked={!!product.eAtivo} />
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

                <InputBase name="code" label="Código" value={product.codigo} />

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

                <InputBase name="ncm" label="Ncm" value={product.ncmFormat} />

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

                <GroupInput>
                  <InputBase
                    name="colorOne"
                    label="Cor 1"
                    value={product.corPrimaria?.descricao}
                  />
                  <InputBase
                    name="colorTwo"
                    label="Cor 2"
                    value={product.corSecundaria?.cor.descricao ?? "-"}
                  />
                </GroupInput>
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
                  {(product.locaisEstoque?.length ?? 0) <= 0 && (
                    <TableCaption>Não há dados a serem exibidos</TableCaption>
                  )}

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
                  {(product.variacoes?.length ?? 0) <= 0 && (
                    <TableCaption>Não há dados a serem exibidos</TableCaption>
                  )}
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
            <DetailContent
              secondaryColumn={
                <>
                  <DetailBox className="flex-row">
                    <div className="flex justify-between items-center">
                      <Switch checked={!!product.possuiFoto} />
                      <span className="ml-2">Possui foto</span>
                    </div>
                  </DetailBox>

                  <DetailBox>
                    <DetailBoxTitle>Imagem de capa</DetailBoxTitle>

                    <InputBase
                      name="previewImage"
                      value={product.imagemPreview}
                    />
                  </DetailBox>
                </>
              }
            >
              <DetailBox>
                <DetailBoxTitle>Biblioteca de Imagens</DetailBoxTitle>

                {(product.imagens?.length ?? 0) <= 0 && (
                  <span className="text-slate-400">
                    Não há imagens cadastradas
                  </span>
                )}

                <div className="flex flex-wrap gap-4">
                  {product.imagens?.map((image) => (
                    <div
                      key={image.nome}
                      className="flex justify-center items-center flex-col"
                    >
                      <div className="bg-white rounded-lg overflow-hidden border-2 border-slate-400 w-[120px] h-[120px] flex items-center justify-center">
                        <ImageWithFallback
                          alt={image.nome}
                          src={`${spaceImages}/Produtos/${image.nome}`}
                          height={120}
                          width={120}
                        />
                      </div>
                      <span className="text-sm">{image.nome}</span>
                    </div>
                  ))}
                </div>
              </DetailBox>
            </DetailContent>
          </TabsContent>
        </Tabs>
      </DetailMain>
    </DetailPage>
  );
}
