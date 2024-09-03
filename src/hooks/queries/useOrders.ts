import { spaceImages } from "@/global/parameters";
import { setupAPIClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import * as dateFns from "date-fns";
import { GetServerSidePropsContext } from "next";
import { mask } from "remask";
import { Client } from "./useClients";
import { Product } from "./useProducts";
import { Seller } from "./useSellers";

export const orderStatusStyle = {
  1: { textColor: "text-yellow-600", bgColor: "bg-yellow-600" },
  2: { textColor: "text-blue-600", bgColor: "bg-blue-700" },
  3: { textColor: "text-green-600", bgColor: "bg-green-600" },
  4: { textColor: "text-red-600", bgColor: "bg-red-600" },
  5: { textColor: "text-red-600", bgColor: "bg-red-600" },
  6: { textColor: "text-purple-600", bgColor: "bg-purple-600" },
  7: { textColor: "text-orange-600", bgColor: "bg-orange-500" },
  8: { textColor: "text-red-600", bgColor: "bg-red-600" },
  9: { textColor: "text-purple-500", bgColor: "bg-purple-500" },
};
export const orderStatusColorAnalytic = [
  {
    name: "Recebido",
    color: "rgb(0, 143, 250)",
  },
  {
    name: "Faturado",
    color: "rgb(0, 227, 150)",
  },
  {
    name: "Falha na transmissão",
    color: "rgb(119, 92, 207)",
  },
  {
    name: "Diferenciado",
    color: "rgb(119, 92, 207)",
  },
  {
    name: "Recusado",
    color: "rgb(119, 92, 207)",
  },
  {
    name: "Cancelado",
    color: "rgb(255, 69, 96)",
  },
  {
    name: "Reprovado",
    color: "rgb(255, 69, 96)",
  },
  {
    name: "Rascunho",
    color: "rgb(254, 175, 26)",
  },
  {
    name: "Não transmitido",
    color: "rgb(254, 175, 26)",
  },
];

export type Order = {
  codigo: number;
  codigoErp: number;
  dataFaturamento: Date;
  dataFaturamentoFormat: string;
  createdAt: Date;
  createdAtFormat: string;
  valorTotal: number;
  valorTotalFormat: string;
  eRascunho: boolean;
  eDiferenciado: boolean;
  tipoDesconto?: "VALOR" | "PERCENTUAL";
  descontoCalculado?: number;
  descontoValorFormat: string;
  cancelamentoValor?: number;
  cancelamentoValorFormat?: string;
  descontoCalculadoFormat?: string;
  descontoPercentual?: number;
  descontoValor?: number;
  vendedorPendenteDiferenciado?: Seller;
  diferenciados: Differentiated[];
  situacaoPedido: {
    codigo: number;
    descricao: string;
  };
  vendedores: {
    tipo: number;
    vendedor: {
      codigo: number;
      nome: string;
      nomeGuerra: string;
    };
  }[];
  condicaoPagamento: {
    codigo: number;
    descricao: string;
  };
  cliente: Client;
  periodoEstoque: {
    periodo: string;
    descricao: string;
  };
  tabelaPreco: {
    codigo: number;
    descricao: string;
  };
  pedidoErp?: {
    dataFaturamento: Date;
    valorTotal: number;
    valorTotalFormat?: string;
  };
  itens: ItemOrder[];
  registros: RegisterOrder[];
};

export type ItemOrder = {
  codigo: string;
  quantidade: number;
  valorUnitario: number;
  valorUnitarioFormat: string;
  valorTotalFormat: string;
  sequencia: number;
  produto: Product;

  itemErp?: {
    quantidade: number;
    valorUnitario: number;
    valorTotalFormat: string;
    situacao: string;

    motivoRecusa?: {
      codigo: number;
      descricao: string;
    };
    motivoCancelamento?: {
      codigo: number;
      descricao: string;
    };
  };
};

export type Differentiated = {
  id: string;
  isActive: boolean;
  descontoPercentual?: string;
  descontoValor?: number;
  tipoDesconto?: "VALOR" | "PERCENTUAL";
  motivoDiferenciado?: string;

  passo?: number;
  descontoCalculado: number;
  eFinalizado?: boolean;
  eAprovado?: boolean;
  descontoCalculadoFormat?: string;
  tipoUsuario?: string;

  vendedor?: Seller;

  createdAt: Date;
  createdAtFormat: string;
  updatedAt?: Date;
};

export type RegisterOrder = {
  id: string;
  situacaoCodigo: number;
  requsicao: string;
  resposta: string;
  createdAt: Date;
  createdAtFormat: string;
};

type OrderApiResponse = {
  data: Order[];
  page: number;
  pagesize: number;
  total: number;
};

type GetOrdersResponse = {
  orders: Order[];
  page: number;
  pagesize: number;
  total: number;
};

export type OrderAnalyticPeriod =
  | "7-days"
  | "14-days"
  | "1-month"
  | "3-month"
  | "1-year";

interface OrderAnalyticNormalizedProps {
  qtd: number;
  totalFormat: string;
  averageTicketFomat: string;
  orderAnalytic: OrderAnalyticPeriodProps[];
  series: { data: number[]; name: string }[];
}

interface OrderAnalyticProps {
  analisePeriodo: OrderAnalyticPeriodProps[];
  quantidadeTotal: number;
  valorTotal: number;
  ticketMedio: number;
}

interface OrderAnalyticPeriodProps {
  periodo: Date;
  itens: OrderAnalyticItemProps[];
}

type OrderAnalyticItemProps = {
  valorTotal: number;
  quantidade: number;
  situacao: string;
};

interface GetOrdersProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  search?: string;
}

export async function getOrders({
  page,
  pagesize,
  orderby,
  search,
}: GetOrdersProps): Promise<GetOrdersResponse> {
  const { data } = await api.get<OrderApiResponse>("/panel/orders", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
      search,
    },
  });

  const normalized = data.data.map((order) => ({
    ...order,
    valorTotalFormat: order.valorTotal.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),
    createdAtFormat: dateFns.format(order.createdAt, "dd/MM/uuuu à's' HH:mm"),
  }));

  const response: GetOrdersResponse = {
    orders: normalized,
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
  };

  return response;
}
export async function getOrderOne(
  cod: number,
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<Order> {
  var apiOrder = api;

  if (ctx) {
    apiOrder = setupAPIClient(ctx);
  }

  const { data: order } = await apiOrder.get<Order>(`/panel/orders/${cod}`);

  const cancelamentoValor = order.itens.reduce(
    (previousValue, currentValue) =>
      currentValue?.itemErp?.situacao === "Cancelado"
        ? currentValue?.itemErp?.valorUnitario *
            currentValue?.itemErp?.quantidade +
          previousValue
        : previousValue,
    0
  );

  const descontoCalculado =
    order.valorTotal - (order.descontoCalculado ?? 0) - cancelamentoValor;

  return {
    ...order,

    pedidoErp: order.pedidoErp
      ? {
          ...order.pedidoErp,
          valorTotalFormat: order.pedidoErp?.valorTotal?.toLocaleString(
            "pt-br",
            {
              style: "currency",
              currency: "BRL",
            }
          ),
        }
      : undefined,

    descontoCalculado: descontoCalculado,
    descontoCalculadoFormat: descontoCalculado.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),
    descontoValor: order.descontoCalculado ?? 0,
    descontoValorFormat: Number(order?.descontoCalculado ?? 0).toLocaleString(
      "pt-br",
      {
        style: "currency",
        currency: "BRL",
      }
    ),
    cancelamentoValor: cancelamentoValor,
    cancelamentoValorFormat: Number(cancelamentoValor).toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),

    createdAtFormat: dateFns.format(order.createdAt, "dd/MM/uuuu à's' HH:mm"),
    dataFaturamentoFormat: dateFns.format(
      order.dataFaturamento,
      "dd/MM/uuuu à's' HH:mm"
    ),

    cliente: {
      ...order.cliente,
      cnpjFormat: mask(order.cliente.cnpj, "99.999.999/9999-99"),
    },

    registros: order.registros.map((register) => ({
      ...register,
      createdAtFormat: dateFns.format(
        register.createdAt,
        "dd/MM/uuuu à's' HH:mm"
      ),
    })),

    itens: order.itens.map((item) => ({
      ...item,

      produto: {
        ...item.produto,
        imagemPreview: item.produto.imagemPreview
          ? `${spaceImages}/Produtos/${item.produto.imagemPreview}_smaller`
          : `${spaceImages}/Produtos/${item.produto.referencia}_smaller`,
      },

      valorUnitarioFormat: item.valorUnitario.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
      valorTotalFormat: (item.valorUnitario * item.quantidade).toLocaleString(
        "pt-br",
        {
          style: "currency",
          currency: "BRL",
        }
      ),
    })),

    diferenciados: order.diferenciados.map((differentiated) => ({
      ...differentiated,
      descontoCalculadoFormat: differentiated.descontoCalculado.toLocaleString(
        "pt-br",
        {
          style: "currency",
          currency: "BRL",
        }
      ),
      createdAtFormat: dateFns.format(
        differentiated.createdAt,
        "dd/MM/uuuu à's' HH:mm"
      ),
    })),
  };
}

function normalizedSeries({
  analisePeriodo: data,
}: OrderAnalyticProps): { data: number[]; name: string }[] {
  const normalized: {
    data: { period: Date; value: number }[];
    name: string;
  }[] = [];

  const periods: Date[] = data.map((f) => f.periodo);

  for (const row of data) {
    for (const item of row.itens) {
      const find = normalized.find((f) => f.name === item.situacao);

      if (find) {
        find.data = find.data.map((data) =>
          data.period === row.periodo
            ? { value: item.valorTotal, period: data.period }
            : data
        );
      } else {
        normalized.push({
          name: item.situacao,
          data: periods.map((period) =>
            period === row.periodo
              ? { value: item.valorTotal, period: period }
              : { value: 0, period: period }
          ),
        });
      }
    }
  }

  return normalized.map((f) => ({
    name: f.name,
    data: f.data.map((item) => item.value),
  }));
}

export async function getOrderAnalytic(
  period?: OrderAnalyticPeriod,
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<OrderAnalyticNormalizedProps> {
  var apiOrder = api;

  if (ctx) {
    apiOrder = setupAPIClient(ctx);
  }

  const { data } = await apiOrder.get<OrderAnalyticProps>(
    `/panel/orders/analytic`,
    {
      params: {
        periodo: period,
      },
    }
  );

  return {
    qtd: data.quantidadeTotal,
    totalFormat: data.valorTotal.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),
    averageTicketFomat: data.ticketMedio.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),
    orderAnalytic: data.analisePeriodo,
    series: normalizedSeries(data),
  };
}

export function useOrders({ pagesize, page, orderby, search }: GetOrdersProps) {
  return useQuery({
    queryKey: ["orders", pagesize, page, orderby, search],
    queryFn: () => getOrders({ pagesize, page, orderby, search }),
  });
}
export function useOrderOne(
  codigo: number,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery({
    queryKey: ["order", codigo],
    queryFn: () => getOrderOne(codigo, ctx),
  });
}
export function useOrderAnalytic(
  period?: OrderAnalyticPeriod,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery({
    queryKey: ["order-analytic", period],
    queryFn: () => getOrderAnalytic(period, ctx),
  });
}
