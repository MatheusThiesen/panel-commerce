import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export type Group = {
  codigo: number;
  descricao: string;
  ornador: number;
  eAtivo: boolean;
  eVenda: boolean;
};

type GroupApiResponse = {
  data: Group[];
  page: number;
  pagesize: number;
  total: number;
};

type GetGroupsResponse = {
  groups: Group[];
  page: number;
  pagesize: number;
  total: number;
};

interface GetGroupsProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  search?: string;
}

export async function getGroups({
  page,
  pagesize,
  orderby,
  search,
}: GetGroupsProps): Promise<GetGroupsResponse> {
  const { data } = await api.get<GroupApiResponse>("/panel/groups", {
    params: {
      page: page - 1,
      pagesize,
      orderby,
      search,
    },
  });

  const normalized = data.data.map((Group) => ({
    ...Group,
  }));

  const response: GetGroupsResponse = {
    groups: normalized,
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
  };

  return response;
}

export function useGroups({ pagesize, page, orderby, search }: GetGroupsProps) {
  return useQuery({
    queryKey: ["groups", pagesize, page, orderby, search],
    queryFn: () => getGroups({ pagesize, page, orderby, search }),
  });
}
