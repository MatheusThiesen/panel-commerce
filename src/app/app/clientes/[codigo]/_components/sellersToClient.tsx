"use client";

import { CheckboxForm } from "@/components/form/CheckboxForm";
import { DetailBox, DetailBoxTitle } from "@/components/layouts/detail";
import { Loading } from "@/components/loading";
import { Form } from "@/components/ui/form";
import { Client } from "@/hooks/queries/useClients";
import { useSellers } from "@/hooks/queries/useSellers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface SellersToClientProps {
  client: Client;
}

const sellersToClientFormSchema = z.object({
  sellers: z.string().array(),
});

type SellersToClientFormProps = z.infer<typeof sellersToClientFormSchema>;

export function SellersToClient({ client }: SellersToClientProps) {
  const { data, refetch, isLoading } = useSellers({
    page: 1,
    pagesize: 9999,
    filters: {
      eAtivo: true,
    },
  });
  const queryClient = useQueryClient();

  const form = useForm<SellersToClientFormProps>({
    resolver: zodResolver(sellersToClientFormSchema),
    values: {
      sellers: client.vendedores?.map((item) => String(item.codigo)) ?? [],
    },
  });
  const { handleSubmit, control, watch } = form;

  const watchSellersSelected = watch("sellers");

  async function updateClient({ sellers }: SellersToClientFormProps) {
    try {
      // await api.put(`/panel/clients/${client.codigo}`, {
      //   vendedores: sellers,
      // });

      queryClient.invalidateQueries({
        queryKey: ["client-blocks"],
      });

      return sellers;
    } catch (error) {
      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });

      throw new Error(error as any);
    }
  }

  async function handleSubmitBlockClient(data: SellersToClientFormProps) {
    try {
      await updateClient(data);

      toast.success("Bloqueios de cliente alterada com sucesso", {
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
                <DetailBoxTitle>Vendedores</DetailBoxTitle>

                <CheckboxForm
                  name="sellers"
                  checks={watchSellersSelected}
                  data={
                    data?.sellers.map((item) => ({
                      id: String(item.codigo),
                      label: `${item.codigo} - ${item.nomeGuerra}`,
                    })) ?? []
                  }
                  control={control}
                />
              </div>
            </div>

            {/* <DetailActionButton
              type="submit"
              size="lg"
              className="mr-auto ml-0 mt-4 text-md font-bold"
            >
              SALVAR
            </DetailActionButton> */}
          </form>
        </Form>
      )}
    </DetailBox>
  );
}
