import { setupAPIClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";

export type Brand = {
  codigo: number;
  descricao: string;
  valorPedidoMinimo: number;
  valorPedidoMinimoFormat: string;
  eAtivo: boolean;
  eVenda: boolean;
};

type BrandApiResponse = {
  data: Brand[];
  page: number;
  pagesize: number;
  total: number;
};

type GetBrandsResponse = {
  brands: Brand[];
  page: number;
  pagesize: number;
  total: number;
};

interface GetBrandsProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  search?: string;
}

export async function getBrands({
  page,
  pagesize,
  orderby,
  search,
}: GetBrandsProps): Promise<GetBrandsResponse> {
  const { data } = await api.get<BrandApiResponse>("/panel/brands", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
      search,
    },
  });

  const normalized = data.data.map((brand) => ({
    ...brand,
    valorPedidoMinimoFormat: Number(
      brand.valorPedidoMinimo || 0
    ).toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),
  }));

  const response: GetBrandsResponse = {
    brands: normalized,
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
  };

  return response;
}
export async function getBrandOne(
  cod: number,
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<Brand> {
  var apiBrand = api;

  if (ctx) {
    apiBrand = setupAPIClient(ctx);
  }

  const { data: brand } = await apiBrand.get<Brand>(`/panel/brands/${cod}`);

  return {
    ...brand,
    valorPedidoMinimoFormat: Number(
      brand?.valorPedidoMinimo || 0
    )?.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    }),
  };
}

export function useBrands({ pagesize, page, orderby, search }: GetBrandsProps) {
  return useQuery({
    queryKey: ["brands", pagesize, page, orderby, search],
    queryFn: () => getBrands({ pagesize, page, orderby, search }),
  });
}
export function useBrandOne(
  codigo: number,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery({
    queryKey: ["brand", codigo],
    queryFn: () => getBrandOne(codigo, ctx),
  });
}
