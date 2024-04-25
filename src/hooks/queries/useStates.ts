import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export type State = {
  uf: string;
  nome: string;
};

type StatesApiResponse = {
  data: State[];
  total: number;
};

type GetStatesResponse = {
  states: State[];
  total: number;
};

export async function getStates(): Promise<GetStatesResponse> {
  const { data } = await api.get<StatesApiResponse>(`/panel/states/`, {});

  const response: GetStatesResponse = {
    states: data.data,
    total: data.total,
  };

  return response;
}

export function useStates() {
  return useQuery({
    queryKey: ["states"],
    queryFn: () => getStates(),
  });
}
