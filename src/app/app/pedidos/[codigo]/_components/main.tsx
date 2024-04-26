"use client";

import { GroupInput } from "@/components/form/GroupInput";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orderStatusStyle, useOrderOne } from "@/hooks/queries/useOrders";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OrderOptionActions } from "../../_components/orderOptionActions";
import { ProductItem } from "../../_components/productItem";

interface OrderMainProps {
  orderCode: number;
}

export function OrderMain({ orderCode }: OrderMainProps) {
  const { data: order, isLoading, isError } = useOrderOne(orderCode);
  const { push } = useRouter();

  useEffect(() => {
    if (isError) {
      push("/app/inicio");
    }
  }, [isError]);

  if (isLoading || !order) return <ScreenLoading />;

  return (
    <DetailPage>
      <DetailHeader className="justify-between">
        <div className="flex">
          <DetailGoBack />
          <DetailTitle>Pedido #{order.codigo}</DetailTitle>
        </div>

        <OrderOptionActions order={order} />
      </DetailHeader>

      <DetailMain>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="integration">Integração</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="pt-3">
            <DetailContent
              secondaryColumn={
                <>
                  <DetailBox className="flex-row">
                    <DetailBoxTitle>Situação</DetailBoxTitle>

                    <Badge
                      variant="outline"
                      className={cn(
                        orderStatusStyle[
                          (order.situacaoPedido.codigo ?? 1) as 1
                        ].bgColor,
                        "text-white rounded-sm hover:bg text-md"
                      )}
                    >
                      {order.situacaoPedido.descricao}
                    </Badge>
                  </DetailBox>

                  <DetailBox className="flex-row">
                    <div className="flex justify-between items-center">
                      <Switch checked={!!order.eDiferenciado} />
                      <span className="ml-2">Diferenciado</span>
                    </div>
                  </DetailBox>

                  <DetailBox className="w-full">
                    <DetailBoxTitle>Cliente</DetailBoxTitle>

                    <InputBase
                      name="clientCod"
                      label="Código"
                      defaultValue={order.cliente.codigo}
                      readOnly
                    />
                    <InputBase
                      name="clienteName"
                      label="Razão social"
                      defaultValue={order.cliente.razaoSocial}
                      readOnly
                    />
                    <InputBase
                      name="cnpj"
                      label="CNPJ"
                      defaultValue={order.cliente.cnpjFormat}
                      readOnly
                    />
                  </DetailBox>

                  {order.vendedores.map((seller) => (
                    <DetailBox
                      key={
                        seller.vendedor.codigo.toLocaleString() + seller.tipo
                      }
                      className="w-full"
                    >
                      <DetailBoxTitle>
                        {seller.tipo === 1 ? "Vendedor" : "Preposto"}
                      </DetailBoxTitle>

                      <InputBase
                        name="sellerCod"
                        label="Código"
                        defaultValue={seller.vendedor.codigo}
                        readOnly
                      />
                      <InputBase
                        name="sellerName"
                        label="Abreviação"
                        defaultValue={seller.vendedor.nomeGuerra}
                        readOnly
                      />
                      <InputBase
                        name="sellerAllName"
                        label="Nome"
                        defaultValue={seller.vendedor.nome}
                        readOnly
                      />
                    </DetailBox>
                  ))}
                </>
              }
            >
              <DetailBox className="w-full">
                <DetailBoxTitle>Resumo</DetailBoxTitle>

                {order.itens.map((item, index) => (
                  <div key={item.codigo}>
                    {index > 0 && <Separator />}

                    <ProductItem data={item} />
                  </div>
                ))}

                <div className="flex justify-between mt-4 text-sm">
                  <span>Subtotal</span>
                  <span>{order.valorTotalFormat}</span>
                </div>
                <Separator />
                <div className="flex justify-between  text-sm text-red-400">
                  <span>Descontos</span>
                  <span>-{order.descontoValorFormat}</span>
                </div>
                <Separator />

                <div className="flex justify-between text-md text-green-400">
                  <span>Total</span>
                  <span>{order.descontoCalculadoFormat}</span>
                </div>
              </DetailBox>
              <DetailBox className="w-full">
                <DetailBoxTitle>Detalhes</DetailBoxTitle>

                <InputBase
                  name="codeErp"
                  label="Código ERP"
                  defaultValue={order.codigoErp ?? "-"}
                  readOnly
                />
                <InputBase
                  name="priceList"
                  label="Lista de preço"
                  defaultValue={order.tabelaPreco.descricao}
                  readOnly
                />

                <InputBase
                  name="paymentCondition"
                  label="Condição pagamento"
                  defaultValue={order.condicaoPagamento.descricao}
                  readOnly
                />

                <InputBase
                  name="stockPeriod"
                  label="Tipo da venda"
                  defaultValue={order.periodoEstoque.descricao}
                  readOnly
                />

                <GroupInput>
                  <InputBase
                    name="createAt"
                    label="Data de entrada"
                    defaultValue={order.createdAtFormat}
                    readOnly
                  />
                  <InputBase
                    name="billingDate"
                    label="Data de faturamento"
                    defaultValue={order.dataFaturamentoFormat}
                    readOnly
                  />
                </GroupInput>
              </DetailBox>
            </DetailContent>
          </TabsContent>
          <TabsContent value="integration" className="pt-3">
            <DetailContent>
              {order.registros.length <= 0 && (
                <div className="w-full text-center ">
                  <span className="w-full text-foreground">
                    Não há dados a serem exibidos{" "}
                  </span>
                </div>
              )}

              {order.registros.map((register) => (
                <DetailBox key={register.id} className="w-full">
                  <DetailBoxTitle
                    className={cn(
                      register.situacaoCodigo <= 200
                        ? "text-green-600"
                        : "text-red-600",
                      "flex flex-row items-center"
                    )}
                  >
                    {register.situacaoCodigo <= 200 ? (
                      <CircleCheck className="mr-2" />
                    ) : (
                      <CircleX className="mr-2" />
                    )}
                    Registrado em {register.createdAtFormat}
                  </DetailBoxTitle>

                  <div className="w-full flex-wrap flex justify-between gap-4">
                    <div className="flex-1">
                      <span className="font-normal text-md mb-2">
                        REQUISIÇÃO:{" "}
                      </span>

                      <pre className="bg-panel p-4 rounded-md">
                        {JSON.stringify(
                          JSON.parse(register.requsicao),
                          null,
                          2
                        )}
                      </pre>
                    </div>

                    <div className="flex-1">
                      <span className="font-normal text-md mb-2">
                        RESPOSTA:{" "}
                      </span>

                      <pre className="bg-panel p-4 rounded-md">
                        {JSON.stringify(JSON.parse(register.resposta), null, 2)}
                      </pre>
                    </div>
                  </div>
                </DetailBox>
              ))}
            </DetailContent>
          </TabsContent>
        </Tabs>
      </DetailMain>
    </DetailPage>
  );
}
