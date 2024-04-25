import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export type BlockBrand = {
  id: string;
  marcaCodigo: number;
  estado: {
    nome: string;
    uf: string;
  };
};

type BlockBrandApiResponse = {
  data: BlockBrand[];
};

export type GetBrandsResponse = {
  blocks: BlockBrand[];
};

interface GetBlocksBrandProps {
  brandCode: number;
}

export async function getBlocksBrand({
  brandCode,
}: GetBlocksBrandProps): Promise<GetBrandsResponse> {
  const { data } = await api.get<BlockBrandApiResponse>(
    `/panel/brands/blocks/${brandCode}`,
    {}
  );

  const response: GetBrandsResponse = {
    blocks: data.data,
  };

  return response;
}

export function useBlocksBrand({ brandCode }: GetBlocksBrandProps) {
  return useQuery({
    queryKey: ["brands-blocks", brandCode],
    queryFn: () => getBlocksBrand({ brandCode }),
  });
}
