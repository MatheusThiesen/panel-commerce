import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export type RulesConcept = {
  id: string;
  subGrupo: {
    codigo: number;
    descricao: string;
    grupo: {
      codigo: number;
      descricao: string;
    };
  };
  conceito: {
    codigo: number;
    descricao: string;
  };
};

type RulesConceptApiResponse = {
  data: RulesConcept[];
  page: number;
  pagesize: number;
  total: number;
};

type GetRulesConceptResponse = {
  rules: RulesConcept[];
  page: number;
  pagesize: number;
  total: number;
};

interface GetRulesConceptProps {
  page: number;
  pagesize?: number;
  orderby?: string;
  search?: string;
}

export async function getRulesConcept({
  page,
  pagesize,
  orderby,
  search,
}: GetRulesConceptProps): Promise<GetRulesConceptResponse> {
  const { data } = await api.get<RulesConceptApiResponse>(
    "/panel/rules/concept",
    {
      params: {
        page: page - 1,
        pagesize,
        orderby,
        search,
      },
    }
  );

  const response: GetRulesConceptResponse = {
    rules: data.data,
    pagesize: data.pagesize,
    total: data.total,
    page: data.page,
  };

  return response;
}

export function useRulesConcepts({
  pagesize,
  page,
  orderby,
  search,
}: GetRulesConceptProps) {
  return useQuery({
    queryKey: ["rules-concepts", pagesize, page, orderby, search],
    queryFn: () => getRulesConcept({ pagesize, page, orderby, search }),
  });
}
