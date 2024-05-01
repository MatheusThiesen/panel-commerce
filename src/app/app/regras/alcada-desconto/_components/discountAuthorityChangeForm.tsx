"use client";

import { InputForm } from "@/components/form/InputForm";
import { DetailActionButton } from "@/components/layouts/detail";
import { Form } from "@/components/ui/form";
import { SheetFooter } from "@/components/ui/sheet";
import { DiscountAuthority } from "@/hooks/queries/useDiscountAuthorities";
import { api } from "@/services/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface DiscountAuthorityChangeFormProps {
  discountAuthority: DiscountAuthority;
  onClose: () => void;
}

const discountAuthorityFormSchema = z.object({
  sellerType: z.string(),
  approval: z.coerce.number(),
  request: z.coerce.number(),
  hierarchy: z.coerce.number(),
});

type DiscountAuthorityForm = z.infer<typeof discountAuthorityFormSchema>;

export function DiscountAuthorityChangeForm({
  discountAuthority: discountAuthorityData,
  onClose,
}: DiscountAuthorityChangeFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<DiscountAuthorityForm>({
    resolver: zodResolver(discountAuthorityFormSchema),
    defaultValues: {
      sellerType: discountAuthorityData.tipoUsuario,
      approval: discountAuthorityData.percentualAprovacao,
      request: discountAuthorityData.percentualSolicitacao,
      hierarchy: discountAuthorityData.hierarquia,
    },
  });
  const { handleSubmit, control } = form;

  async function updateDiscountAuthority(
    discountAuthority: DiscountAuthorityForm
  ) {
    await api.put(
      `/panel/differentiated-hierarchies/${discountAuthorityData.id}`,
      {
        hierarquia: discountAuthority.hierarchy,
        percentualAprovacao: discountAuthority.approval,
        percentualSolicitacao: discountAuthority.request,
      }
    );

    queryClient.invalidateQueries({
      queryKey: ["discount-authorities"],
    });

    onClose();
  }

  async function handleChangeDiscountAuthority(
    discountAuthority: DiscountAuthorityForm
  ) {
    try {
      toast.promise(updateDiscountAuthority(discountAuthority), {
        loading: "carregando...",
        success: "Alçada desconto salvo com sucesso",
        error:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });

      toast.success("Alçada desconto alterada com sucesso", {
        description: "A Alçada desconto foi alterada com sucesso.",
      });
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
        onSubmit={handleSubmit(handleChangeDiscountAuthority)}
        className="w-full flex-1 flex flex-col justify-between mt-6"
      >
        <InputForm name="sellerType" label="Tipo" control={control} disabled />
        <InputForm name="approval" label="Aprovação" control={control} />
        <InputForm name="request" label="Requisição" control={control} />
        <InputForm name="hierarchy" label="Hierarquia" control={control} />

        <SheetFooter className="mt-auto ">
          <DetailActionButton className="p-5" type="submit">
            Salvar
          </DetailActionButton>
        </SheetFooter>
      </form>
    </Form>
  );
}
