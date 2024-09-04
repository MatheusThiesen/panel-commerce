"use client";

import { CheckboxForm } from "@/components/form/CheckboxForm";
import { SelectForm } from "@/components/form/SelectForm";
import { DetailActionButton } from "@/components/layouts/detail";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const orderFormSchema = z.object({
  status: z.string().array(),
  isDifferentiated: z.string().optional(),
});

type OrderForm = z.infer<typeof orderFormSchema>;

export function OrderFilterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const status = searchParams.get("status");
  const isDifferentiated = searchParams.get("isDifferentiated");

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      status: status?.split("|") ?? [],
      isDifferentiated: isDifferentiated ?? "",
    },
  });
  const { handleSubmit, control } = form;

  async function handleChangeOrder(order: OrderForm) {
    try {
      const params = new URLSearchParams(searchParams);

      params.set("status", order.status.join("|").toString());
      params.set("isDifferentiated", order.isDifferentiated ?? "");

      router.push(`${pathname}?${params.toString()}`);
    } catch (error) {
      console.log(error);
      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    }
  }

  async function handleClearFilterOrder() {
    try {
      const params = new URLSearchParams(searchParams);
      params.set("status", "");
      params.set("isDifferentiated", "");
      router.push(`${pathname}?${params.toString()}`);
    } catch (error) {
      console.log(error);
      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleChangeOrder)}
        className="w-full flex-1 flex flex-col justify-between mt-6 gap-y-4"
      >
        <SelectForm
          name="isDifferentiated"
          label="Diferenciado"
          control={control}
          data={[
            {
              value: "1",
              label: "Sim",
            },
            {
              value: "0",
              label: "Não",
            },
          ]}
        />

        <CheckboxForm
          name="status"
          label="Situação"
          control={control}
          data={[
            { id: "Recebido", label: "Recebido" },
            { id: "Faturado", label: "Faturado" },
            { id: "Cancelado", label: "Cancelado" },
            { id: "Falha na transmissão", label: "Falha na transmissão" },
            { id: "Enviando pedido", label: "Enviando pedido" },
            { id: "Diferenciado", label: "Diferenciado" },
            { id: "Rascunho", label: "Rascunho" },
            { id: "Reprovado", label: "Reprovado" },
            { id: "Recusado", label: "Recusado" },
          ]}
        />

        <SheetFooter className="mt-10">
          <SheetClose asChild>
            <Button variant="link" onClick={handleClearFilterOrder}>
              Limpar
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <DetailActionButton type="submit">Salvar</DetailActionButton>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
