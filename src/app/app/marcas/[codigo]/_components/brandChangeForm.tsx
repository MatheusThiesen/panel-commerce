"use client";

import { Dropzone } from "@/components/Dropzone";
import { InputForm } from "@/components/form/InputForm";
import { DetailActionButton } from "@/components/layouts/detail";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { FileProps } from "@/hooks/queries/useBanners";
import { Brand } from "@/hooks/queries/useBrands";
import { api } from "@/services/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileIcon, X } from "lucide-react";
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
  logo: z.any(),
});

type BrandFormProps = z.infer<typeof brandFormSchema>;

export function BrandChangeForm({ brand }: BrandChangeFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<BrandFormProps>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      code: brand?.codigo,
      name: brand?.descricao,
      minimalPrice: brand?.valorPedidoMinimo,
    },
  });
  const { handleSubmit, control, watch, setValue } = form;

  const watchLogo = watch("logo");

  async function updateBrand(brand: BrandFormProps) {
    let logoId: undefined | string;

    if (brand.logo) {
      const formDataLogo = new FormData();
      formDataLogo.append("file", brand.logo);
      const responseUploaded = await api.post<FileProps>(`/file`, formDataLogo);

      logoId = responseUploaded.data.id;
    }

    await api.put(`/panel/brands/${brand.code}`, {
      codigo: +brand.code,
      descricao: brand.name,
      valorPedidoMinimo: brand.minimalPrice,
      logoId,
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

  async function handleTrashLogo() {
    try {
      if (!brand.logo) {
        toast.success("Logo nao existe", {
          description: "Logo deve existir para poder ser excluída.",
        });
      }

      await api.delete(`/file/${brand.logo?.id}`);

      queryClient.invalidateQueries({
        queryKey: ["brand", brand.codigo],
      });

      toast.success("Logo excluída com sucesso", {
        description: "A logo foi excluída com sucesso.",
      });
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
        <InputForm name="code" label="Código" control={control} disabled />
        <InputForm name="name" label="Nome" control={control} />
        <InputForm
          name="minimalPrice"
          label="Preço mínimo por pedido"
          control={control}
        />

        <FormField
          name="logo"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1 mt-1">
              <FormLabel>Logo</FormLabel>

              {brand.logo && (
                <div className="flex items-center justify-between bg-panel rounded-md p-2 mt-2">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      window.open(brand.logo?.url);
                    }}
                  >
                    <FileIcon className="size-8 mr-2" />
                    <span>{brand.logo.nome}</span>
                  </div>

                  <Button
                    variant="link"
                    type="button"
                    onClick={handleTrashLogo}
                  >
                    <X />
                  </Button>
                </div>
              )}

              {!brand.logo && (
                <>
                  {watchLogo ? (
                    <div className="flex items-center justify-between bg-panel rounded-md p-2">
                      <div className="flex items-center">
                        <FileIcon className="size-8 mr-2" />
                        <span>{watchLogo.name}</span>
                      </div>

                      <Button
                        variant="link"
                        type="button"
                        onClick={() => {
                          setValue("logo", undefined as any);
                        }}
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <FormControl>
                      <Dropzone
                        className="h-28 text-sm mt-3"
                        accept={{ "image/*": [] }}
                        onFileUploaded={(file) => {
                          field.onChange(file[0]);
                        }}
                      />
                    </FormControl>
                  )}
                </>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        <SheetFooter className="mt-auto ">
          <SheetClose asChild>
            <DetailActionButton className="p-5" type="submit">
              Salvar
            </DetailActionButton>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
