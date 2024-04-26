"use client";

import { CheckboxForm } from "@/components/form/CheckboxForm";
import {
  DetailActionButton,
  DetailBox,
  DetailBoxTitle,
} from "@/components/layouts/detail";
import { Loading } from "@/components/loading";
import { Form } from "@/components/ui/form";
import { useBlocksSeller } from "@/hooks/queries/useBlocksSeller";
import { Seller } from "@/hooks/queries/useSellers";
import { api } from "@/services/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface BlocksToSellerProps {
  seller: Seller;
}

const blocksSellerFormSchema = z.object({
  groups: z.string().array(),
  stocksLocation: z.string().array(),
});

type BlocksSellerFormProps = z.infer<typeof blocksSellerFormSchema>;

export function BlocksToSeller({ seller }: BlocksToSellerProps) {
  const { data, refetch, isLoading } = useBlocksSeller({
    sellerCode: seller.codigo,
  });
  const queryClient = useQueryClient();

  const form = useForm<BlocksSellerFormProps>({
    resolver: zodResolver(blocksSellerFormSchema),
    values: {
      stocksLocation:
        data?.blocks?.periodosEstoque.map((item) => item.periodo) ?? [],
      groups: data?.blocks?.grupos.map((item) => String(item.codigo)) ?? [],
    },
  });
  const { handleSubmit, control } = form;

  async function updateBlocks(blocks: BlocksSellerFormProps) {
    try {
      await api.post(`/panel/sellers/blocks/${seller.codigo}`, {
        ...blocks,
      });

      return blocks;
    } catch (error) {
      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });

      throw new Error(error as any);
    }
  }

  const { mutateAsync: updateFn } = useMutation({
    mutationFn: updateBlocks,
    onSuccess(_data: BlocksSellerFormProps) {
      queryClient.invalidateQueries({
        queryKey: ["client-blocks"],
      });
    },
  });

  async function handleSubmitBlockClient(data: BlocksSellerFormProps) {
    try {
      await updateFn(data);

      toast.success("Bloqueios de vendedor alterada com sucesso", {
        description: "Os bloqueios foram alterados com sucesso.",
      });

      refetch();
    } catch (error) {
      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    }
  }

  return (
    <DetailBox className="pb-8 mb-6">
      {isLoading && <Loading />}

      {!isLoading && (
        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleSubmitBlockClient)}
            className="w-full flex-1 flex flex-col justify-between"
          >
            <div className="flex flex-col md:flex-row md:flex-wrap gap-3 justify-between">
              <div className="flex-1">
                <DetailBoxTitle>Local estoque</DetailBoxTitle>

                <CheckboxForm
                  name="stocksLocation"
                  data={
                    data?.options?.periodosEstoque?.map((item) => ({
                      id: item.periodo,
                      label: item.descricao,
                    })) ?? []
                  }
                  control={control}
                />
              </div>

              <div className="flex-1">
                <DetailBoxTitle>Grupo</DetailBoxTitle>

                <CheckboxForm
                  name="groups"
                  data={
                    data?.options?.grupos?.map((item) => ({
                      id: item.codigo.toString(),
                      label: item.descricao,
                    })) ?? []
                  }
                  control={control}
                />
              </div>
            </div>

            <DetailActionButton
              type="submit"
              size="lg"
              className="mr-auto ml-0 mt-4 text-md font-bold"
            >
              SALVAR
            </DetailActionButton>
          </form>
        </Form>
      )}
    </DetailBox>
  );
}
