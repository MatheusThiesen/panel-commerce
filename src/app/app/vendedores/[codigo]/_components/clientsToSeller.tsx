"use client";

import { CheckboxForm } from "@/components/form/CheckboxForm";
import { DetailBox, DetailBoxTitle } from "@/components/layouts/detail";
import { Form } from "@/components/ui/form";
import { Seller } from "@/hooks/queries/useSellers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ClientsToSellerProps {
  seller: Seller;
}

const clientsToSellerFormSchema = z.object({
  clients: z.string().array(),
});

type ClientsToSellerFormProps = z.infer<typeof clientsToSellerFormSchema>;

export function ClientsToSeller({ seller }: ClientsToSellerProps) {
  const form = useForm<ClientsToSellerFormProps>({
    resolver: zodResolver(clientsToSellerFormSchema),
    values: {
      clients: seller.clientes?.map((client) => client.codigo.toString()) ?? [],
    },
  });

  const { handleSubmit, control, watch } = form;

  const watchClientsSelected = watch("clients");

  return (
    <DetailBox className="pb-8 mb-6">
      <Form {...form}>
        <form
          className="w-full flex-1 flex flex-col justify-between"
          onSubmit={handleSubmit(() => {})}
        >
          <div className="flex-1">
            <DetailBoxTitle>Clientes</DetailBoxTitle>

            <CheckboxForm
              name="clients"
              data={
                seller?.clientes?.map((item) => ({
                  id: item.codigo.toString(),
                  label: `${item.codigo} - ${item.razaoSocial}`,
                })) ?? []
              }
              checks={watchClientsSelected}
              control={control}
              disabled
            />
          </div>
        </form>
      </Form>
    </DetailBox>
  );
}
