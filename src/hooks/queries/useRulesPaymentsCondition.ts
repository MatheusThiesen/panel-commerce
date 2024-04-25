import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export type PaymentsCondition = {
  id: string;
  eApenasDiferenciado: boolean;
  eAtivo: boolean;
  valorMinimo: number;
  valorMinimoFormat: string;
  condicaoPagamento: {
    codigo: number;
    descricao: string;
  };
  localCobranca: {
    codigo: number;
    descricao: string;
  };
  listaPrecoCodigo: boolean;
  marca: {
    codigo: number;
    descricao: string;
  };
};

type PaymentsConditionApiResponse = {
  data: PaymentsCondition[];
  page: number;
  pagesize: number;
  total: number;
};

type GetPaymentsConditionResponse = {
  rules: PaymentsCondition[];
  page: number;
  pagesize: number;
  total: number;
};

interface GetPaymentsConditionProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  search?: string;
}

export async function getRulesPaymentsCondition({
  page,
  pagesize,
  orderby,
  search,
}: GetPaymentsConditionProps): Promise<GetPaymentsConditionResponse> {
  const { data } = await api.get<PaymentsConditionApiResponse>(
    "/panel/rules/payment-condition",
    {
      params: {
        page: page - 1,
        pagesize,
        orderby,
        search,
      },
    }
  );

  const response: GetPaymentsConditionResponse = {
    rules: data.data.map((item) => ({
      ...item,
      valorMinimoFormat: item.valorMinimo.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
    })),
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
  };

  return response;
}

export function useRulesPaymentsCondition({
  pagesize,
  page,
  orderby,
  search,
}: GetPaymentsConditionProps) {
  return useQuery({
    queryKey: ["rules-payments-condition", pagesize, page, orderby, search],
    queryFn: () =>
      getRulesPaymentsCondition({ pagesize, page, orderby, search }),
  });
}
