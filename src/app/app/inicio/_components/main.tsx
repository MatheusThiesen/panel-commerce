"use client";

import { AnalyticCard } from "@/components/analytic-card";
import {
  DetailBox,
  DetailContent,
  DetailHeader,
  DetailMain,
  DetailPage,
  DetailSubtitle,
  DetailTitle,
} from "@/components/layouts/detail";
import { Loading } from "@/components/loading";
import { ScreenLoading } from "@/components/loading-screen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AccessAnalyticPeriod,
  useAccessAnalytic,
} from "@/hooks/queries/useAccess";
import {
  OrderAnalyticPeriod,
  orderStatusColorAnalytic,
  useOrderAnalytic,
} from "@/hooks/queries/useOrders";
import { useAuth } from "@/hooks/useAuth";
import {
  Activity,
  CircleUser,
  Diamond,
  DollarSign,
  FolderLock,
  ShoppingBag,
  Store,
  Tag,
  Users,
} from "lucide-react";
import { useState } from "react";
import { ListQuickAccess } from "./ListQuickAccess";

import { ImageWithFallback } from "@/components/ImageWithFallback";
import { ScrollArea } from "@/components/ui/scroll-area";
import { spaceImages } from "@/global/parameters";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function HomeMain() {
  const [periodOrderAnalytic, setPeriodOrderAnalytic] =
    useState<OrderAnalyticPeriod>("7-days");
  const [periodAccessAnalytic, setPeriodAccessAnalytic] =
    useState<AccessAnalyticPeriod>("7-days");

  const { user } = useAuth();
  const orderAnalytic = useOrderAnalytic(periodOrderAnalytic);
  useAccessAnalytic;
  const accessAnalytic = useAccessAnalytic(periodAccessAnalytic);
  useAccessAnalytic;

  if (!user) return <ScreenLoading />;

  return (
    <DetailPage>
      <DetailHeader>
        <DetailTitle className="capitalize">{`Olá, ${user?.nome}`}</DetailTitle>
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

        <div className="grid gap-4 grid-cols-3 mt-8">
          <AnalyticCard
            icon={DollarSign}
            title="Total pedidos"
            value={orderAnalytic.data?.totalFormat}
            isLoading={orderAnalytic.isLoading}
          />
          <AnalyticCard
            icon={Activity}
            title="Quantidade"
            value={orderAnalytic.data?.qtd?.toString()}
            isLoading={orderAnalytic.isLoading}
          />
          <AnalyticCard
            icon={Users}
            title="Ticked médio"
            value={orderAnalytic.data?.averageTicketFomat}
            isLoading={orderAnalytic.isLoading}
          />
        </div>

        <DetailContent className="flex flex-col mt-8">
          <DetailBox>
            <DetailSubtitle className="capitalize flex justify-between">
              <span>Pedidos</span>

              <div className="w-56">
                <Select
                  onValueChange={(e: any) => setPeriodOrderAnalytic(e)}
                  defaultValue={periodOrderAnalytic}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar..." />
                  </SelectTrigger>

                  <SelectContent>
                    {[
                      { value: "7-days", label: "Últimos 7 dias" },
                      { value: "14-days", label: "Últimos 14 dias" },
                      { value: "1-month", label: "Mês atual" },
                      { value: "3-month", label: "Últimos 3 meses" },
                      { value: "1-year", label: "Ano atual" },
                    ].map((item) => (
                      <SelectItem value={item.value} key={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DetailSubtitle>

            {!orderAnalytic.isLoading ? (
              <Chart
                type="area"
                height={200}
                series={orderAnalytic.data?.series ?? []}
                options={{
                  chart: {
                    toolbar: {
                      show: false,
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  grid: {
                    show: false,
                  },
                  colors: orderAnalytic.data?.series.map((serie) => {
                    const find = orderStatusColorAnalytic.find(
                      (f) => f.name === serie.name
                    );
                    return find?.color ?? "";
                  }),

                  fill: {
                    opacity: 0.3,
                    type: "gradient",
                    gradient: {
                      opacityFrom: 0.7,
                      opacityTo: 0.3,
                    },
                  },

                  yaxis: {
                    labels: {
                      formatter: (value) =>
                        value.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        }),
                    },
                  },

                  xaxis: {
                    labels: {
                      formatter: (value) =>
                        ["7-days", "14-days", "1-month"].includes(
                          periodOrderAnalytic
                        )
                          ? new Date(value).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                            })
                          : new Date(value).toLocaleDateString("pt-BR", {
                              month: "short",
                              year: "2-digit",
                            }),
                    },

                    categories: orderAnalytic.data?.orderAnalytic?.map(
                      (item) => item.periodo
                    ),
                  },
                }}
              />
            ) : (
              <Loading />
            )}
          </DetailBox>
        </DetailContent>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <DetailBox className="justify-start">
            <DetailSubtitle>Produtos mais vendidos</DetailSubtitle>

            {!orderAnalytic.isLoading ? (
              <ScrollArea className="h-80 pr-6">
                {orderAnalytic.data?.bestSellingProducts.map((product) => (
                  <div
                    key={product.codigo}
                    className="flex justify-between items-center mb-2"
                  >
                    <ImageWithFallback
                      width={60}
                      height={60}
                      className="object-contain w-16 h-16 bg-white"
                      src={`${spaceImages}/Produtos/${
                        product.imagemPreview ?? "no_image"
                      }_smaller`}
                      alt={product.descricao}
                    />
                    <div className="flex flex-col text-start flex-1 ml-2">
                      <span className="text-xs font-semibold">
                        {product.descricao}
                      </span>
                      <span className="text-xs font-light ">
                        {`${product.referencia} (${product.codigo})`}
                      </span>
                    </div>

                    <span className="font-bold">{product.total}</span>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <Loading />
            )}
          </DetailBox>
          <DetailBox className="justify-start">
            <DetailSubtitle>Produtos mais clicados</DetailSubtitle>

            {!orderAnalytic.isLoading ? (
              <ScrollArea className="h-80 pr-6">
                {orderAnalytic.data?.bestClickProducts.map((product) => (
                  <div
                    key={product.codigo}
                    className="flex justify-between items-center mb-2"
                  >
                    <ImageWithFallback
                      width={60}
                      height={60}
                      className="object-contain w-16 h-16 bg-white"
                      src={`${spaceImages}/Produtos/${
                        product.imagemPreview ?? "no_image"
                      }_smaller`}
                      alt={product.descricao}
                    />
                    <div className="flex flex-col text-start flex-1 ml-2">
                      <span className="text-xs font-semibold">
                        {product.descricao}
                      </span>
                      <span className="text-xs font-light ">
                        {`${product.referencia} (${product.codigo})`}
                      </span>
                    </div>

                    <span className="font-bold">{product.total}</span>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <Loading />
            )}
          </DetailBox>
        </div>

        <DetailContent className="flex flex-col mt-8">
          <DetailBox>
            <DetailSubtitle className="capitalize flex justify-between">
              <span>Acessos</span>

              <div className="w-56">
                <Select
                  onValueChange={(e: any) => setPeriodAccessAnalytic(e)}
                  defaultValue={periodAccessAnalytic}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar..." />
                  </SelectTrigger>

                  <SelectContent>
                    {[
                      { value: "7-days", label: "Últimos 7 dias" },
                      { value: "14-days", label: "Últimos 14 dias" },
                      { value: "1-month", label: "Mês atual" },
                      { value: "3-month", label: "Últimos 3 meses" },
                      { value: "1-year", label: "Ano atual" },
                    ].map((item) => (
                      <SelectItem value={item.value} key={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DetailSubtitle>

            {!accessAnalytic.isLoading ? (
              <Chart
                type="area"
                height={200}
                series={accessAnalytic.data?.accessAnalytic.series ?? []}
                options={{
                  chart: {
                    toolbar: {
                      show: false,
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  grid: {
                    show: false,
                  },
                  fill: {
                    opacity: 0.3,
                    type: "gradient",
                    gradient: {
                      opacityFrom: 0.7,
                      opacityTo: 0.3,
                    },
                  },
                  yaxis: {
                    labels: {
                      formatter: (value) => String(value),
                    },
                  },
                  xaxis: {
                    labels: {
                      formatter: (value) =>
                        ["7-days", "14-days", "1-month"].includes(
                          periodAccessAnalytic
                        )
                          ? new Date(value).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                            })
                          : new Date(value).toLocaleDateString("pt-BR", {
                              month: "short",
                              year: "2-digit",
                            }),
                    },
                    categories:
                      accessAnalytic.data?.accessAnalytic?.accessAnalytic?.map(
                        (item) => item.periodo
                      ),
                  },
                }}
              />
            ) : (
              <Loading />
            )}
          </DetailBox>
        </DetailContent>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <DetailBox>
            <DetailSubtitle className="flex flex-col">
              Clientes mais acessaram
            </DetailSubtitle>

            {!accessAnalytic.isLoading ? (
              <div className="flex flex-col gap-y-4">
                {accessAnalytic.data?.rankingAccessClient.map((client) => (
                  <div
                    key={client.clienteCodigo}
                    className="flex justify-between items-center"
                  >
                    <Store className="size-7" />
                    <div className="flex flex-col text-start flex-1 ml-2">
                      <span className="text-xs font-normal">{`${client.razaoSocial} (${client.clienteCodigo})`}</span>
                      <span className="text-xs font-thin ">{client.cnpj}</span>
                    </div>

                    <span className="font-bold">{client.total}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Loading />
            )}
          </DetailBox>
          <DetailBox>
            <DetailSubtitle>Representantes mais acessaram</DetailSubtitle>

            {!accessAnalytic.isLoading ? (
              <div className="flex flex-col gap-y-4">
                {accessAnalytic.data?.rankingAccessSeller.map((seller) => (
                  <div
                    key={seller.vendedorCodigo}
                    className="flex justify-between items-center"
                  >
                    <CircleUser className="size-7" />
                    <div className="flex flex-col text-start flex-1 ml-2">
                      <span className="text-xs font-normal">{`${seller.nome} (${seller.vendedorCodigo})`}</span>
                      <span className="text-xs font-thin ">{seller.email}</span>
                    </div>

                    <span className="font-bold">{seller.total}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Loading />
            )}
          </DetailBox>
        </div>
      </DetailMain>
    </DetailPage>
  );
}
