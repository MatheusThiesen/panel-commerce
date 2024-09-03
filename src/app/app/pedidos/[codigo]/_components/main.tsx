"use client";

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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  }, [isError, push]);

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
            {order.registros.length > 0 && (
              <TabsTrigger value="integration">Integração</TabsTrigger>
            )}
            {order.eDiferenciado && (
              <TabsTrigger value="differentiated">Diferenciado</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="general" className="pt-3">
            <DetailContent
              secondaryColumn={
                <>
                  <DetailBox className="hidden lg:flex">
                    <div className="flex flex-row justify-between items-center w-full">
                      <DetailBoxTitle>Situação</DetailBoxTitle>

                      <Badge
                        variant="outline"
                        className={cn(
                          orderStatusStyle[
                            (order.situacaoPedido?.codigo ?? 1) as 1
                          ].bgColor,
                          "text-white rounded-lg hover:bg text-md "
                        )}
                      >
                        {order.situacaoPedido?.descricao}
                      </Badge>
                    </div>

                    {order.codigoErp > 0 && (
                      <div className="text-sm w-full">
                        <span className="font-thin">CÓDIGO ERP:</span>
                        <span className="font-bold">{order.codigoErp}</span>
                      </div>
                    )}
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
              <DetailBox className="flex lg:hidden">
                <div className="flex flex-row justify-between items-center w-full">
                  <DetailBoxTitle>Situação</DetailBoxTitle>

                  <Badge
                    variant="outline"
                    className={cn(
                      orderStatusStyle[(order.situacaoPedido?.codigo ?? 1) as 1]
                        .bgColor,
                      "text-white rounded-lg hover:bg text-md "
                    )}
                  >
                    {order.situacaoPedido?.descricao}
                  </Badge>
                </div>

                {order.codigoErp > 0 && (
                  <div className="text-sm w-full">
                    <span className="font-thin">CÓDIGO ERP:</span>
                    <span className="font-bold">{order.codigoErp}</span>
                  </div>
                )}
              </DetailBox>

              <DetailBox className="w-full">
                <DetailBoxTitle>Detalhes</DetailBoxTitle>

                {order.codigoErp > 0 && (
                  <InputBase
                    name="codeErp"
                    label="Código ERP"
                    defaultValue={order.codigoErp ?? "-"}
                    readOnly
                  />
                )}

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

              <DetailBox className="w-full">
                <DetailBoxTitle>Resumo</DetailBoxTitle>

                {order.itens.map((item) => (
                  <div key={item.codigo}>
                    <ProductItem
                      data={item}
                      status={order.situacaoPedido?.descricao}
                    />

                    {<Separator />}
                  </div>
                ))}

                <div className="flex justify-between  text-sm">
                  <span>Subtotal</span>
                  <span>{order.valorTotalFormat}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm ">
                  <span>Descontos</span>
                  <span className="text-green-500">
                    -{order.descontoValorFormat}
                  </span>
                </div>

                {Number(order.cancelamentoValor ?? 0) > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-sm ">
                      <span>Cancelamentos</span>
                      <span className="text-red-400">
                        -{order.cancelamentoValorFormat}
                      </span>
                    </div>
                  </>
                )}

                <Separator />
                <div className="flex justify-between text-md font-bold">
                  <span>Valor total</span>
                  <span>{order.descontoCalculadoFormat}</span>
                </div>
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
          <TabsContent value="differentiated" className="pt-3">
            <DetailContent
              secondaryColumn={
                order.vendedorPendenteDiferenciado && (
                  <DetailBox className="w-full">
                    <DetailBoxTitle>Pendente de aprovação</DetailBoxTitle>

                    <InputBase
                      name="sellerCod"
                      label="Código"
                      defaultValue={order.vendedorPendenteDiferenciado?.codigo}
                      readOnly
                    />
                    <InputBase
                      name="sellerName"
                      label="Abreviação"
                      defaultValue={
                        order.vendedorPendenteDiferenciado?.nomeGuerra
                      }
                      readOnly
                    />
                    <InputBase
                      name="sellerAllName"
                      label="Nome"
                      defaultValue={order.vendedorPendenteDiferenciado?.nome}
                      readOnly
                    />
                    <InputBase
                      name="sellerType"
                      label="Permissão"
                      defaultValue={
                        order.vendedorPendenteDiferenciado?.tipoVendedor
                      }
                      readOnly
                    />
                  </DetailBox>
                )
              }
            >
              {order.diferenciados.map((differentiated) => (
                <DetailBox
                  className={cn(
                    "w-full",
                    differentiated.eAprovado === true
                      ? "border-green-600 border-4"
                      : differentiated.eAprovado === false
                      ? "border-red-600 border-4"
                      : ""
                  )}
                  key={differentiated.id}
                >
                  <DetailBoxTitle>
                    {differentiated.vendedor?.tipoVendedor}
                  </DetailBoxTitle>

                  <GroupInput>
                    <InputBase
                      name="sellerCod"
                      label="Código"
                      defaultValue={differentiated.vendedor?.codigo}
                      readOnly
                    />
                    <InputBase
                      name="sellerAllName"
                      label="Nome"
                      defaultValue={differentiated.vendedor?.nome}
                      readOnly
                    />
                  </GroupInput>

                  <DetailBoxTitle>Desconto</DetailBoxTitle>

                  <GroupInput>
                    <InputBase
                      name="discountType"
                      label="Tipo de desconto"
                      defaultValue={`${differentiated.tipoDesconto} ${
                        differentiated.tipoDesconto === "PERCENTUAL"
                          ? `( ${differentiated.descontoPercentual}% )`
                          : ""
                      }`}
                      readOnly
                    />

                    <InputBase
                      name="discountValue"
                      label="Valor"
                      defaultValue={differentiated.descontoCalculadoFormat}
                      readOnly
                    />
                  </GroupInput>

                  <InputBase
                    name="createAt"
                    label="Criado em"
                    defaultValue={differentiated.createdAtFormat}
                    readOnly
                  />

                  <TextareaBase
                    name="observation"
                    label="Observação"
                    defaultValue={differentiated.motivoDiferenciado}
                    readOnly
                  />
                </DetailBox>
              ))}
            </DetailContent>
          </TabsContent>
        </Tabs>
      </DetailMain>
    </DetailPage>
  );
}
