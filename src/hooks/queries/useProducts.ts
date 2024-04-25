import { spaceImages } from "@/global/parameters";
import { setupAPIClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { mask } from "remask";

export type StockLocation = {
  id?: string;
  descricao: string;
  periodo: string;
  quantidade?: number;
};

export type Brand = {
  codigo: number;
  descricao: string;
};

export type Product = {
  eAtivo: boolean;
  codigo: number;
  codigoAlternativo: string;
  referencia: string;
  descricao: string;
  descricaoComplementar: string;
  descricaoAdicional: string;
  ncm: string;
  ncmFormat: string;
  obs: string;
  qtdEmbalagem: number;
  unidade?: {
    unidade: string;
    descricao: string;
  };
  precoVenda: number;
  precoVendaFormat: string;
  precoVendaEmpresa: number;
  precoVendaEmpresaFormat: string;
  precoTabela28?: number;
  precoTabela42?: number;
  precoTabela56?: number;
  precoTabela300?: number;
  precoTabela28Format?: string;
  precoTabela42Format?: string;
  precoTabela56Format?: string;
  precoTabela300Format?: string;
  locaisEstoque?: StockLocation[];
  marca: Brand;
  colecao?: {
    codigo: number;
    descricao: string;
  };
  grupo?: {
    codigo: number;
    descricao: string;
  };
  subGrupo?: {
    codigo: number;
    descricao: string;
  };
  genero?: {
    codigo: number;
    descricao: string;
  };
  linha?: {
    codigo: number;
    descricao: string;
  };
  corPrimaria?: {
    codigo: number;
    descricao: string;
  };
  corSecundaria?: {
    cor: {
      codigo: number;
      descricao: string;
    };
  };
  variacoes?: VariationsProduct[];
  grades?: {
    codigo: number;
    descricaoAdicional: string;
    precoVenda: number;
    precoTabela28: number;
    locaisEstoque: {
      id: string;
      descricao: string;
      quantidade: number;
    }[];
  }[];
  listaPreco?: {
    id: string;
    codigo: number;
    descricao: string;
    valor: number;
    valorFormat: string;
  }[];
  imagens?: {
    nome: string;
  }[];
  imagemPreview: string;
};

export interface VariationsProduct {
  codigo: number;
  codigoAlternativo: number;
  referencia: string;
  imagemPreview?: string;
  descricao: string;

  imagens?: {
    nome: string;
  }[];

  corPrimaria: {
    descricao: string;
  };
  corSecundaria: {
    cor: {
      descricao: string;
    };
  };
}

type ProductApiResponse = {
  data: Product[];
  page: number;
  pagesize: number;
  total: number;
};

type GetProductsResponse = {
  products: Omit<Product, "variacoes">[];
  page: number;
  pagesize: number;
  total: number;
};

interface GetProductsProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  search?: string;
}

export async function getProducts({
  page,
  pagesize,
  orderby,
  search,
}: GetProductsProps): Promise<GetProductsResponse> {
  const { data } = await api.get<ProductApiResponse>("/panel/products", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
      search,
    },
  });

  const response: GetProductsResponse = {
    products: data.data.map((product) => ({
      ...product,
      imagemPreview: product.imagemPreview
        ? `${spaceImages}/Produtos/${product.imagemPreview}_smaller`
        : `${spaceImages}/Produtos/${product.referencia}_smaller`,
      precoVendaFormat: product.precoVenda.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
      precoVendaEmpresaFormat: product?.precoVendaEmpresa
        ? product?.precoVendaEmpresa.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "R$ -",
      precoTabela28Format: product?.precoTabela28
        ? product?.precoTabela28.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "-",
      precoTabela42Format: product?.precoTabela42
        ? product?.precoTabela42.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "-",
      precoTabela56Format: product?.precoTabela56
        ? product?.precoTabela56.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "-",
      precoTabela300Format: product?.precoTabela300
        ? product?.precoTabela300.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "-",
      listaPreco: product.listaPreco?.map((list) => ({
        ...list,
        valorFormat: list.valor.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        }),
      })),
    })),
    pagesize: data.pagesize,
    page: data.page,
    total: data.total,
  };

  return response;
}
export async function getProductOne(
  cod: number,
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<Product | undefined> {
  var apiClient = api;

  if (ctx) {
    apiClient = setupAPIClient(ctx);
  }

  if (cod) {
    const { data } = await apiClient.get<Product>(`/panel/products/${cod}`);

    const product: Product = {
      ...data,
      precoVendaFormat: data.precoVenda.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
      precoVendaEmpresaFormat: data.precoVendaEmpresa
        ? data.precoVendaEmpresa.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "R$ -",
      listaPreco: data.listaPreco?.map((list) => ({
        ...list,
        valorFormat: list.valor.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        }),
      })),

      ncmFormat: mask(data.ncm, "9999.99.99"),
    };

    return product;
  }

  return undefined;
}

export function useProducts({
  pagesize,
  page,
  orderby,
  search,
}: GetProductsProps) {
  return useQuery({
    queryKey: ["products", pagesize, page, orderby, search],
    queryFn: () => getProducts({ pagesize, page, orderby, search }),
  });
}
export function useProductOne(
  codigo: number,
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  return useQuery({
    queryKey: ["product", codigo],
    queryFn: () => getProductOne(codigo, ctx),
  });
}
