"use client";

import { InputForm } from "@/components/form/InputForm";
import { SelectForm } from "@/components/form/SelectForm";
import { DetailActionButton } from "@/components/layouts/detail";
import { Form } from "@/components/ui/form";
import { SheetFooter } from "@/components/ui/sheet";
import { Group } from "@/hooks/queries/useGroups";
import { api } from "@/services/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface GroupChangeFormProps {
  group: Group;
  onClose: () => void;
}

const groupFormSchema = z.object({
  code: z.coerce.number(),
  description: z.string(),
  isActive: z.string(),
  orderby: z.coerce.number(),
  isSales: z.string(),
});

type GroupForm = z.infer<typeof groupFormSchema>;

export function GroupChangeForm({
  group: groupData,
  onClose,
}: GroupChangeFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<GroupForm>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      code: groupData.codigo,
      description: groupData.descricao,
      orderby: groupData.ornador,
      isActive: groupData.eAtivo ? "1" : "0",
      isSales: groupData.eVenda ? "1" : "0",
    },
  });
  const { handleSubmit, control } = form;

  async function updateGroup(group: GroupForm) {
    await api.put(`/panel/groups/${groupData.codigo}`, {
      ornador: !isNaN(Number(group.orderby)) ? group.orderby : undefined,
      eAtivo: Number(group.isActive) === 1 ? true : false,
      eVenda: Number(group.isSales) === 1 ? true : false,
    });

    queryClient.invalidateQueries({
      queryKey: ["groups"],
    });

    onClose();
  }

  async function handleChangeGroup(group: GroupForm) {
    try {
      toast.promise(updateGroup(group), {
        loading: "carregando...",
        success: "Grupo salvo com sucesso",
        error:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });

      toast.success("Grupo alterada com sucesso", {
        description: "A Grupo foi alterada com sucesso.",
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
        onSubmit={handleSubmit(handleChangeGroup)}
        className="w-full flex-1 flex flex-col justify-between mt-6"
      >
        <InputForm name="code" label="Código" control={control} disabled />
        <InputForm name="description" label="Descrição" control={control} />
        <InputForm name="orderby" label="Ordenação" control={control} />

        <SelectForm
          name="isSales"
          label="Venda"
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
        <SelectForm
          name="isActive"
          label="Ativo"
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

        <SheetFooter className="mt-auto ">
          <DetailActionButton className="p-5" type="submit">
            Salvar
          </DetailActionButton>
        </SheetFooter>
      </form>
    </Form>
  );
}
