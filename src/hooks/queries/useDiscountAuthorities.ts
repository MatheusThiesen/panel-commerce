import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

type SellerType = "DIRETOR" | "GERENTE" | "SUPERVISOR" | "VENDEDOR";

export type DiscountAuthority = {
  id: string;
  tipoUsuario: SellerType;
  percentualAprovacao: number;
  percentualSolicitacao: number;
  hierarquia: number;
};

type DiscountAuthoritiesApiResponse = {
  data: DiscountAuthority[];
  page: number;
  pagesize: number;
  total: number;
};

type GetDiscountAuthoritiesResponse = {
  discountAuthorities: DiscountAuthority[];
  page: number;
  pagesize: number;
  total: number;
};

interface GetDiscountAuthoritiesProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  search?: string;
}

export async function getDiscountAuthorities({
  page,
  pagesize,
  orderby,
  search,
}: GetDiscountAuthoritiesProps): Promise<GetDiscountAuthoritiesResponse> {
  const { data } = await api.get<DiscountAuthoritiesApiResponse>(
    "/panel/differentiated-hierarchies",
    {
      params: {
        page: page - 1,
        pagesize,
        orderby,
        search,
      },
    }
  );

  const response: GetDiscountAuthoritiesResponse = {
    discountAuthorities: data.data,
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
  };

  return response;
}

export function useDiscountAuthorities({
  pagesize,
  page,
  orderby,
  search,
}: GetDiscountAuthoritiesProps) {
  return useQuery({
    queryKey: ["discount-authorities", pagesize, page, orderby, search],
    queryFn: () => getDiscountAuthorities({ pagesize, page, orderby, search }),
  });
}
