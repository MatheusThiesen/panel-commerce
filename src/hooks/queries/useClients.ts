import { setupAPIClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { mask } from "remask";
import { Seller } from "./useSellers";

export type Client = {
  eAtivo: boolean;
  codigo: number;
  razaoSocial: string;
  nomeFantasia: string;
  cidade: string;
  cep: string;
  cepFormat: string;
  cnpj: string;
  cnpjFormat: string;
  uf: string;
  bairro: string;
  logradouro: string;
  numero: string;
  incricaoEstadual: string;
  complemento?: string;
  celular: string;
  telefone: string;
  telefone2?: string;
  celularFormat?: string;
  telefoneFormat?: string;
  telefone2Format?: string;
  obs?: string;
  email?: string;
  email2?: string;

  titulo?: {
    id: string;
  }[];
  conceito?: {
    codigo: string;
    descricao: string;
  };
  ramoAtividade?: {
    codigo: string;
    descricao: string;
  };
  vendedores?: Seller[];
};

type ClientApiResponse = {
  data: Client[];
  page: number;
  pagesize: number;
  total: number;
};

type GetClientsResponse = {
  clients: Client[];
  page: number;
  pagesize: number;
  total: number;
};

interface GetClientsProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  search?: string;
}

export async function getClients({
  page,
  pagesize,
  orderby,
  search,
}: GetClientsProps): Promise<GetClientsResponse> {
  const { data } = await api.get<ClientApiResponse>("/panel/clients", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
      search,
    },
  });

  const response: GetClientsResponse = {
    clients: data.data.map((client) => ({
      ...client,
      cepFormat: mask(client.cep, "99999-999"),
      cnpjFormat: mask(client.cnpj, "99.999.999/9999-99"),
      telefone2Format: client.telefone2
        ? mask(client.telefone2, [
            "9999-9999",
            "99999-9999",
            "(99) 9999-9999",
            "(99) 99999-9999",
          ])
        : undefined,
      telefoneFormat: client.telefone
        ? mask(client.telefone, [
            "9999-9999",
            "99999-9999",
            "(99) 9999-9999",
            "(99) 99999-9999",
          ])
        : undefined,
    })),
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
  };

  return response;
}
export async function getClientOne(
  cod: number,
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<Client> {
  var apiClient = api;

  if (ctx) {
    apiClient = setupAPIClient(ctx);
  }

  const { data: client } = await apiClient.get<Client>(`/panel/clients/${cod}`);

  const product: Client = {
    ...client,
    cepFormat: mask(client.cep, "99999-999"),
    cnpjFormat: mask(client.cnpj, "99.999.999/9999-99"),
    celularFormat: client.celular
      ? mask(client.celular, [
          "9999-9999",
          "99999-9999",
          "(99) 9999-9999",
          "(99) 99999-9999",
        ])
      : undefined,
    telefone2Format: client.telefone2
      ? mask(client.telefone2, [
          "9999-9999",
          "99999-9999",
          "(99) 9999-9999",
          "(99) 99999-9999",
        ])
      : undefined,
    telefoneFormat: client.telefone
      ? mask(client.telefone, [
          "9999-9999",
          "99999-9999",
          "(99) 9999-9999",
          "(99) 99999-9999",
        ])
      : undefined,
  };

  return product;
}

export function useClients({
  pagesize,
  page,
  orderby,
  search,
}: GetClientsProps) {
  return useQuery({
    queryKey: ["clients", pagesize, page, orderby, search],
    queryFn: () => getClients({ pagesize, page, orderby, search }),
  });
}
export function useClientOne(
  codigo: number,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery({
    queryKey: ["client", codigo],
    queryFn: () => getClientOne(codigo, ctx),
  });
}
