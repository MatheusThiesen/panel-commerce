"use client";

import { InputForm } from "@/components/form/InputForm";
import { DetailActionButton } from "@/components/layouts/detail";
import { Form } from "@/components/ui/form";
import { Brand } from "@/hooks/queries/useBrands";
import { api } from "@/services/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface BrandChangeFormProps {
  brand: Brand;
}

const brandFormSchema = z.object({
  code: z.coerce.number(),
  name: z.string(),
  minimalPrice: z.coerce.number(),
  isSale: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

type BrandFormProps = z.infer<typeof brandFormSchema>;

export function BrandChangeForm({ brand }: BrandChangeFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<BrandFormProps>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      code: brand?.codigo,
      name: brand?.descricao,
      minimalPrice: brand?.valorPedidoMinimo,
    },
  });
  const { handleSubmit, control } = form;

  async function updateBrand(brand: BrandFormProps) {
    await api.put(`/panel/brands/${brand.code}`, {
      codigo: +brand.code,
      descricao: brand.name,
      valorPedidoMinimo: brand.minimalPrice,
    });

    return brand;
  }

  const { mutateAsync: updateBrandFn } = useMutation({
    mutationFn: updateBrand,
    onSuccess({ code }: BrandFormProps) {
      queryClient.invalidateQueries({
        queryKey: ["brands"],
      });
      queryClient.invalidateQueries({
        queryKey: ["brand", code],
      });
    },
  });

  async function handleChangeBrand(brand: BrandFormProps) {
    try {
      await updateBrandFn(brand);
      router.push("/app/marcas");
      toast.success("Marca alterada com sucesso", {
        description: "A marca foi alterada com sucesso.",
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
        onSubmit={handleSubmit(handleChangeBrand)}
        className="w-full flex-1 flex flex-col justify-between"
      >
        <InputForm name="code" label="Código" control={control} disabled />
        <InputForm name="name" label="Nome" control={control} />
        <InputForm
          name="minimalPrice"
          label="Preço mínimo por pedido"
          control={control}
        />

        <div className="mt-auto">
          <DetailActionButton className="p-5" type="submit">
            Salvar
          </DetailActionButton>
        </div>
      </form>
    </Form>
  );
}
