"use client";

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

const productFormSchema = z.object({
  isSale: z.string().optional(),
  isImage: z.string().optional(),
});

type ProductForm = z.infer<typeof productFormSchema>;

export function ProductFilterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isImage = searchParams.get("isImage");
  const isSale = searchParams.get("isSale");

  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      isImage: isImage ?? "",
      isSale: isSale ?? "",
    },
  });
  const { handleSubmit, control } = form;

  async function handleChangeProduct(product: ProductForm) {
    try {
      const params = new URLSearchParams(searchParams);

      params.set("isSale", product.isSale ?? "");
      params.set("isImage", product.isImage ?? "");

      router.push(`${pathname}?${params.toString()}`);
    } catch (error) {
      console.log(error);
      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    }
  }

  async function handleClearFilterProduct() {
    try {
      const params = new URLSearchParams(searchParams);
      params.set("isSale", "");
      params.set("isImage", "");
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
        onSubmit={handleSubmit(handleChangeProduct)}
        className="w-full flex-1 flex flex-col justify-between mt-6 gap-y-4"
      >
        <SelectForm
          name="isSale"
          label="Disponível venda"
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
          name="isImage"
          label="Possui foto"
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

        <SheetFooter className="mt-10">
          <SheetClose asChild>
            <Button variant="link" onClick={handleClearFilterProduct}>
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
