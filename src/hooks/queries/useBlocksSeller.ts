import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export type BlocksSeller = {
  blocks: {
    id: string;
    periodosEstoque: StockPeriod[];
    grupos: Group[];
  };

  options: {
    periodosEstoque: StockPeriod[];
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

type BlocksSellerApiResponse = {
  blocks?: {
    id: string;
    periodosEstoque: StockPeriod[];
    grupos: Group[];
  };

  options: {
    periodosEstoque: StockPeriod[];
    grupos: Group[];
  };
};

export type GetBlocksSellerResponse = {
  blocks?: {
    id: string;
    periodosEstoque: StockPeriod[];
    grupos: Group[];
  };

  options: {
    periodosEstoque: StockPeriod[];
    grupos: Group[];
  };
};

interface GetBlocksSellerProps {
  sellerCode: number;
}

export async function getBlocksSeller({
  sellerCode,
}: GetBlocksSellerProps): Promise<GetBlocksSellerResponse> {
  const { data } = await api.get<BlocksSellerApiResponse>(
    `/panel/sellers/blocks/${sellerCode}`
  );

  const response = data;

  return response;
}

export function useBlocksSeller({ sellerCode }: GetBlocksSellerProps) {
  return useQuery({
    queryKey: ["seller-blocks", sellerCode],
    queryFn: () => getBlocksSeller({ sellerCode }),
  });
}
