import { setupAPIClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { Brand } from "./useBrands";

export type Seller = {
  codigo: number;
  email: string;
  nome: string;
  nomeGuerra: string;
  eAtivo: boolean;
  eDiretor: boolean;
  eGerente: boolean;
  eSupervisor: boolean;
  codDiretor: number;
  codGerente: number;
  codSupervisor: number;
  tipoVendedor: "DIRETOR" | "SUPERVISOR" | "GERENTE" | "VENDEDOR";

  marcas?: Brand[];
};

type SellerApiResponse = {
  data: Seller[];
  page: number;
  pagesize: number;
  total: number;
};

type GetSellersResponse = {
  sellers: Seller[];
  page: number;
  pagesize: number;
  total: number;
};

interface GetSellersProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  search?: string;
}

export async function getSellers({
  page,
  pagesize,
  orderby,
  search,
}: GetSellersProps): Promise<GetSellersResponse> {
  const { data } = await api.get<SellerApiResponse>("/panel/sellers", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
      search,
    },
  });

  const response: GetSellersResponse = {
    sellers: data.data,
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
  };

  return response;
}
export async function getSellerOne(
  cod: number,
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<Seller> {
  var apiSeller = api;

  if (ctx) {
    apiSeller = setupAPIClient(ctx);
  }

  const { data: seller } = await apiSeller.get<Seller>(`/panel/sellers/${cod}`);

  return seller;
}

export function useSellers({
  pagesize,
  page,
  orderby,
  search,
}: GetSellersProps) {
  return useQuery({
    queryKey: ["sellers", pagesize, page, orderby, search],
    queryFn: () => getSellers({ pagesize, page, orderby, search }),
  });
}
export function useSellerOne(
  codigo: number,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery({
    queryKey: ["seller", codigo],
    queryFn: () => getSellerOne(codigo, ctx),
  });
}
