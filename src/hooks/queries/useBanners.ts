import { setupAPIClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { Brand } from "./useBrands";

export type Banner = {
  id: string;
  titulo: string;
  qtdClicks: number;
  eAtivo: boolean;

  imagemDesktop: FileProps;
  imagemMobile: FileProps;

  marcas: Brand[];
  colecoes: {
    codigo: number;
    descricao: string;
  }[];
  locaisEstoque: {
    periodo: string;
    descricao: string;
  }[];
  grupos: {
    codigo: number;
    descricao: string;
  }[];
  generos: {
    codigo: number;
    descricao: string;
  }[];
  linhas: {
    codigo: number;
    descricao: string;
  }[];
};

type BannerApiResponse = {
  data: Banner[];
  page: number;
  pagesize: number;
  total: number;
};

type GetBannersResponse = {
  banners: Banner[];
  page: number;
  pagesize: number;
  total: number;
};

interface GetBannersProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  search?: string;
}

export type FileProps = {
  id: string;
  nome: string;
  tamanho: number;
  url: string;
  tipoArquivo: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getBanners({
  page,
  pagesize,
  orderby,
  search,
}: GetBannersProps): Promise<GetBannersResponse> {
  const { data } = await api.get<BannerApiResponse>("/panel/banners", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
      search,
    },
  });

  const normalized = data.data.map((banner) => banner);

  const response: GetBannersResponse = {
    banners: normalized,
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
  };

  return response;
}
export async function getBannerOne(
  cod: string,
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<Banner> {
  var apiBanner = api;

  if (ctx) {
    apiBanner = setupAPIClient(ctx);
  }

  const { data: banner } = await apiBanner.get<Banner>(`/panel/banners/${cod}`);

  return {
    ...banner,
  };
}

export function useBanners({
  pagesize,
  page,
  orderby,
  search,
}: GetBannersProps) {
  return useQuery({
    queryKey: ["banners", pagesize, page, orderby, search],
    queryFn: () => getBanners({ pagesize, page, orderby, search }),
  });
}
export function useBannerOne(
  codigo: string,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery({
    queryKey: ["banner", codigo],
    queryFn: () => getBannerOne(codigo, ctx),
  });
}
