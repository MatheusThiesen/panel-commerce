import { setupAPIClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";

export type AccessAnalyticPeriod =
  | "7-days"
  | "14-days"
  | "1-month"
  | "3-month"
  | "1-year";

interface AccessAnalyticNormalizedProps {
  accessAnalytic: {
    accessAnalytic: AccessAnalyticProps[];
    series: { data: number[]; name: string }[];
  };

  rankingAccessSeller: {
    vendedorCodigo: number;
    email: string;
    nomeGuerra: string;
    nome: string;
    total: number;
  }[];

  rankingAccessClient: {
    clienteCodigo: number;
    email: string;
    cnpj: string;
    razaoSocial: string;
    total: number;
  }[];
}

interface GetAccessAnalyticProps {
  analiseAcessos: { periodo: Date; itens: AccessAnalyticItemProps[] }[];
  rankingAcessosVendedor: {
    vendedorCodigo: number;
    email: string;
    nomeGuerra: string;
    nome: string;
    total: number;
  }[];
  rankingAcessosClient: {
    clienteCodigo: number;
    email: string;
    cnpj: string;
    razaoSocial: string;
    total: number;
  }[];
}

interface AccessAnalyticProps {
  periodo: Date;
  itens: AccessAnalyticItemProps[];
}

type AccessAnalyticItemProps = {
  quantidade: number;
  tipoUsuario: string;
};

function normalizedSeries(
  data: AccessAnalyticProps[]
): { data: number[]; name: string }[] {
  const normalized: {
    data: { period: Date; value: number }[];
    name: string;
  }[] = [];

  const periods: Date[] = data.map((f) => f.periodo);

  for (const row of data) {
    for (const item of row.itens) {
      const find = normalized.find((f) => f.name === item.tipoUsuario);

      if (find) {
        find.data = find.data.map((data) =>
          data.period === row.periodo
            ? { value: item.quantidade, period: data.period }
            : data
        );
      } else {
        normalized.push({
          name: item.tipoUsuario,
          data: periods.map((period) =>
            period === row.periodo
              ? { value: item.quantidade, period: period }
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

export async function getAccessAnalytic(
  period?: AccessAnalyticPeriod,
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<AccessAnalyticNormalizedProps> {
  var apiAccess = api;

  if (ctx) {
    apiAccess = setupAPIClient(ctx);
  }

  const { data } = await apiAccess.get<GetAccessAnalyticProps>(
    `/auth/analytic`,
    {
      params: {
        periodo: period,
      },
    }
  );

  return {
    rankingAccessSeller: data.rankingAcessosVendedor,
    rankingAccessClient: data.rankingAcessosClient,
    accessAnalytic: {
      accessAnalytic: data.analiseAcessos,
      series: normalizedSeries(data.analiseAcessos),
    },
  };
}
export function useAccessAnalytic(
  period?: AccessAnalyticPeriod,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery({
    queryKey: ["access-analytic", period],
    queryFn: () => getAccessAnalytic(period, ctx),
  });
}
