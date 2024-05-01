"use client";

import { SelectForm } from "@/components/form/SelectForm";
import { DetailActionButton } from "@/components/layouts/detail";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { BlockBrand } from "@/hooks/queries/useBlocksBrand";
import { Brand } from "@/hooks/queries/useBrands";
import { useStates } from "@/hooks/queries/useStates";
import { api } from "@/services/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CreateBlockBrandFormProps {
  brand: Brand;
  blocks: BlockBrand[];
}

const brandFormSchema = z.object({
  uf: z.string({
    required_error: "É obrigatório",
  }),
});

type BrandFormProps = z.infer<typeof brandFormSchema>;

export function CreateBlockBrandForm({
  brand,
  blocks,
}: CreateBlockBrandFormProps) {
  const { data: states, refetch } = useStates();
  const queryClient = useQueryClient();

  const form = useForm<BrandFormProps>({
    resolver: zodResolver(brandFormSchema),
  });
  const { handleSubmit, control, reset } = form;

  async function createBlock(block: BrandFormProps) {
    await api.post(`/panel/brands/blocks/${brand.codigo}`, {
      uf: block.uf,
    });

    return block;
  }

  const { mutateAsync: createBlockFn } = useMutation({
    mutationFn: createBlock,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["brands-blocks"],
      });
    },
  });

  async function handleChangeBrand(brand: BrandFormProps) {
    try {
      await createBlockFn(brand);
      toast.success("Bloqueio criado com sucesso", {
        description: "O bloqueio foi criado com sucesso.",
      });
      reset();
      refetch();
    } catch (error) {
      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleChangeBrand)}
        className="w-full flex-1 flex flex-col justify-between"
      >
        <SelectForm
          control={control}
          name="uf"
          data={
            states?.states
              .filter(
                (item) => !blocks.map((b) => b.estado.uf).includes(item.uf)
              )
              .map((state) => ({
                label: state.uf,
                value: state.uf,
              })) ?? []
          }
          className="mb-8"
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button className="p-5" type="button" variant="link">
              Cancelar
            </Button>
          </DialogClose>

          <DetailActionButton className="p-5" type="submit">
            Criar
          </DetailActionButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
