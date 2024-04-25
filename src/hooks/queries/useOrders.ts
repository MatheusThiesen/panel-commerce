import { spaceImages } from "@/global/parameters";
import { setupAPIClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import * as dateFns from "date-fns";
import { GetServerSidePropsContext } from "next";
import { mask } from "remask";
import { Client } from "./useClients";
import { Product } from "./useProducts";

export const orderStatusStyle = {
  1: { textColor: "text-yellow-600", bgColor: "bg-yellow-600" },
  2: { textColor: "text-blue-600", bgColor: "bg-blue-700" },
  3: { textColor: "text-green-600", bgColor: "bg-green-600" },
  4: { textColor: "text-red-600", bgColor: "bg-red-600" },
  5: { textColor: "text-red-600", bgColor: "bg-red-600" },
  6: { textColor: "text-purple-600", bgColor: "bg-purple-600" },
  7: { textColor: "text-orange-600", bgColor: "bg-orange-500" },
  8: { textColor: "text-red-600", bgColor: "bg-red-600" },
};

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
  descontoCalculadoFormat?: string;
  descontoPercentual?: number;
  descontoValor?: number;
  vendedorPendenteDiferenciadoCodigo?: number;
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
};

export type Differentiated = {
  id: string;
  isActive: boolean;
  descontoPercentual?: string;
  descontoValor?: number;
  tipoDesconto?: "VALOR" | "PERCENTUAL";
  motivoDiferenciado?: string;

  passo?: number;
  descontoCalculado?: number;
  eFinalizado?: boolean;
  eAprovado?: boolean;
  descontoCalculadoFormat?: string;
  tipoUsuario?: string;

  vendedor?: {
    codigo: number;
    nome: string;
    nomeGuerra: string;
  };

  createdAt?: Date;
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

  return {
    ...order,

    descontoValorFormat: Number(order.descontoCalculado ?? 0).toLocaleString(
      "pt-br",
      {
        style: "currency",
        currency: "BRL",
      }
    ),
    valorTotalFormat: order.valorTotal.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),
    descontoCalculado: order.valorTotal - (order.descontoCalculado ?? 0),
    descontoCalculadoFormat: (
      order.valorTotal - (order.descontoCalculado ?? 0)
    ).toLocaleString("pt-br", {
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
