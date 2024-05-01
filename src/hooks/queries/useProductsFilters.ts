import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export type FilterList = {
  label: string;
  name: string;
  data: ItemFilter[];
};
export type ItemFilter = {
  name: string;
  value: number | string;
  field: number | string;
};

export type ProductApiResponse = FilterList[];

type GetProductsResponse = {
  filters: FilterList[];
};

interface useProductsFiltersProps {
  filters?: ItemFilter[];
}

export async function getProductsFilters({
  filters,
}: useProductsFiltersProps): Promise<GetProductsResponse> {
  const { data } = await api.get<ProductApiResponse>("/products/filters", {
    params: {
      filters: filters?.map((filter) => ({
        name: filter.name,
        value: filter.value,
      })),
    },
  });

  const response: GetProductsResponse = {
    filters: data,
  };

  return response;
}

export function useProductsFilters({ filters }: useProductsFiltersProps) {
  return useQuery({
    queryKey: ["products-filters", filters],
    queryFn: () => getProductsFilters({ filters }),
  });
}
