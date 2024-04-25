import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Brand } from "./useBrands";

export type BlocksClient = {
  blocks: {
    id: string;
    periodosEstoque: StockPeriod[];
    marcas: Brand[];
    grupos: Group[];
  };

  options: {
    periodosEstoque: StockPeriod[];
    marcas: Brand[];
    grupos: Group[];
  };
};

type Group = {
  codigo: number;
  descricao: string;
};

type StockPeriod = {
  periodo: string;
  descricao: string;
};

type BlocksClientApiResponse = {
  blocks?: {
    id: string;
    periodosEstoque: StockPeriod[];
    marcas: Brand[];
    grupos: Group[];
  };

  options: {
    periodosEstoque: StockPeriod[];
    marcas: Brand[];
    grupos: Group[];
  };
};

export type GetBlocksClientResponse = {
  blocks?: {
    id: string;
    periodosEstoque: StockPeriod[];
    marcas: Brand[];
    grupos: Group[];
  };

  options: {
    periodosEstoque: StockPeriod[];
    marcas: Brand[];
    grupos: Group[];
  };
};

interface GetBlocksClientProps {
  clientCode: number;
}

export async function getBlocksClient({
  clientCode,
}: GetBlocksClientProps): Promise<GetBlocksClientResponse> {
  const { data } = await api.get<BlocksClientApiResponse>(
    `/panel/clients/blocks/${clientCode}`
  );

  const response = data;

  return response;
}

export function useBlocksClient({ clientCode }: GetBlocksClientProps) {
  return useQuery({
    queryKey: ["client-blocks", clientCode],
    queryFn: () => getBlocksClient({ clientCode }),
  });
}
