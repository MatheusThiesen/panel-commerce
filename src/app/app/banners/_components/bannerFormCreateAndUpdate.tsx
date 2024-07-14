"use client";

import { Dropzone } from "@/components/Dropzone";
import { CheckboxForm } from "@/components/form/CheckboxForm";
import { GroupInput } from "@/components/form/GroupInput";
import { InputForm } from "@/components/form/InputForm";
import { SelectForm } from "@/components/form/SelectForm";
import { DetailActionButton } from "@/components/layouts/detail";
import { ScreenLoading } from "@/components/loading-screen";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { SheetFooter } from "@/components/ui/sheet";
import { Banner, FileProps } from "@/hooks/queries/useBanners";
import { useProductsFilters } from "@/hooks/queries/useProductsFilters";
import { getFileFromUrl } from "@/lib/get-file-from-url";
import { api } from "@/services/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FileIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface BannerFormCreateAndUpdateProps {
  banner?: Banner;
}

const bannerFormSchema = z.object({
  id: z.string().optional(),
  active: z.string().optional(),

  title: z.string({
    required_error: "É obrigatório",
  }),

  // imageMobile: z.instanceof(File, { message: "É obrigatório" }),
  // imageDesktop: z.instanceof(File, { message: "É obrigatório" }),

  imageMobile: z.any(),
  imageDesktop: z.any(),

  colecoes: z.string().array(),
  locaisEstoque: z.string().array(),
  marcas: z.string().array(),
  grupos: z.string().array(),
  generos: z.string().array(),
  linhas: z.string().array(),
});

type BannerFormProps = z.infer<typeof bannerFormSchema>;

const dataFilters: any = {
  colecaoCodigo: "colecoes",
  locaisEstoque: "locaisEstoque",
  linhaCodigo: "linhas",
  grupoCodigo: "grupos",
  marcaCodigo: "marcas",
  generoCodigo: "generos",
};

export function BannerFormCreateAndUpdate({
  banner: bannerData,
}: BannerFormCreateAndUpdateProps) {
  const { data: filtersData, isLoading } = useProductsFilters({});
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoadingFetchImagem, setIsLoadingFetchImagem] = useState(false);

  const form = useForm<BannerFormProps>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      id: bannerData?.id,
      active: bannerData?.eAtivo ? "1" : "0",
      title: bannerData?.titulo,
      colecoes: bannerData?.colecoes.map((item) => String(item.codigo)) ?? [],
      locaisEstoque:
        bannerData?.locaisEstoque.map((item) => String(item.periodo)) ?? [],
      marcas: bannerData?.marcas.map((item) => String(item.codigo)) ?? [],
      grupos: bannerData?.grupos.map((item) => String(item.codigo)) ?? [],
      generos: bannerData?.generos.map((item) => String(item.codigo)) ?? [],
      linhas: bannerData?.linhas.map((item) => String(item.codigo)) ?? [],
    },
  });
  const { handleSubmit, control, watch, setValue } = form;

  useEffect(() => {
    (async () => {
      if (bannerData) {
        setIsLoadingFetchImagem(true);

        if (bannerData?.imagemDesktop) {
          const getImagemDesktop = await getFileFromUrl({
            url: bannerData.imagemDesktop.url,
            name: bannerData.imagemDesktop.nome,
            defaultType: bannerData.imagemDesktop.tipoArquivo,
          });

          setValue("imageDesktop", getImagemDesktop);
        }

        if (bannerData?.imagemMobile) {
          const getImagemMobile = await getFileFromUrl({
            url: bannerData.imagemMobile.url,
            name: bannerData.imagemMobile.nome,
            defaultType: bannerData.imagemMobile.tipoArquivo,
          });

          setValue("imageMobile", getImagemMobile);
        }
        setIsLoadingFetchImagem(false);
      }
    })();
  }, [bannerData]);

  const watchImageDesktop = watch("imageDesktop");
  const watchImageMobile = watch("imageMobile");

  const watchStocksLocationSelected = watch("locaisEstoque");
  const watchGroupsSelected = watch("grupos");
  const watchBrandsSelected = watch("marcas");
  const watchLinesSelected = watch("linhas");
  const watchCollectionsSelected = watch("colecoes");
  const watchGenresSelected = watch("generos");

  async function createBanner(banner: BannerFormProps) {
    const formDataImageDesktop = new FormData();
    formDataImageDesktop.append("file", banner.imageDesktop);
    const responseImageDesktopUploaded = await api.post<FileProps>(
      `/file`,
      formDataImageDesktop
    );

    const formDataImageMobile = new FormData();
    formDataImageMobile.append("file", banner.imageMobile);
    const responseImageMobileUploaded = await api.post<FileProps>(
      `/file`,
      formDataImageMobile
    );

    await api.post(`/panel/banners`, {
      titulo: banner.title,
      imagemDesktopId: responseImageDesktopUploaded.data.id,
      imagemMobileId: responseImageMobileUploaded.data.id,
      colecoes: banner.colecoes,
      locaisEstoque: banner.locaisEstoque,
      marcas: banner.marcas,
      grupos: banner.grupos,
      generos: banner.generos,
      linhas: banner.linhas,
    });

    queryClient.invalidateQueries({
      queryKey: ["banners"],
    });

    router.push("/app/banners");

    return banner;
  }

  async function updateBanner(banner: BannerFormProps) {
    await api.put(`/panel/banners/${bannerData?.id}`, {
      titulo: banner.title,
      eAtivo: banner.active === "1",
      colecoes: banner.colecoes,
      locaisEstoque: banner.locaisEstoque,
      marcas: banner.marcas,
      grupos: banner.grupos,
      generos: banner.generos,
      linhas: banner.linhas,
    });

    queryClient.invalidateQueries({
      queryKey: ["banners"],
    });

    router.push("/app/banners");

    return banner;
  }

  async function handleChangeBrand(banner: BannerFormProps) {
    try {
      const promiseCreateBanner = bannerData
        ? updateBanner(banner)
        : createBanner(banner);

      toast.promise(promiseCreateBanner, {
        loading: "carregando...",
        success: "Banner salvo com sucesso",
        error:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    } catch (error) {
      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    }
  }

  if (isLoading || isLoadingFetchImagem) return <ScreenLoading />;

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleChangeBrand)}
        className=" flex flex-col gap-y-4 w-full"
      >
        {!!bannerData && (
          <>
            <InputForm name="id" label="Id" disabled control={control} />
            <SelectForm
              name="active"
              label="Ativo"
              control={control}
              data={[
                { label: "Sim", value: "1" },
                { label: "Não", value: "0" },
              ]}
            />
          </>
        )}

        <InputForm name="title" label="Titulo" control={control} />

        <GroupInput>
          <FormField
            name="imageDesktop"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Imagem desktop</FormLabel>

                {watchImageDesktop ? (
                  <div
                    className="flex items-center justify-between bg-panel rounded-md p-2"
                    onClick={() => {
                      bannerData && window.open(bannerData.imagemDesktop.url);
                    }}
                  >
                    <div className="flex items-center">
                      <FileIcon className="size-8 mr-2" />
                      <span>{watchImageDesktop.name}</span>
                    </div>

                    {!bannerData && (
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => {
                          setValue("imageDesktop", undefined as any);
                        }}
                      >
                        <X />
                      </Button>
                    )}
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

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="imageMobile"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Imagem mobile</FormLabel>

                {watchImageMobile ? (
                  <div
                    className="flex items-center justify-between bg-panel rounded-md p-2"
                    onClick={() => {
                      bannerData && window.open(bannerData.imagemMobile.url);
                    }}
                  >
                    <div className="flex items-center">
                      <FileIcon className="size-8 mr-2" />
                      <span>{watchImageMobile.name}</span>
                    </div>

                    {!bannerData && (
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => {
                          setValue("imageMobile", undefined as any);
                        }}
                      >
                        <X />
                      </Button>
                    )}
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

                <FormMessage />
              </FormItem>
            )}
          />
        </GroupInput>

        <GroupInput>
          {filtersData?.filters
            ?.filter((f) =>
              [
                "colecaoCodigo",
                "locaisEstoque",
                "linhaCodigo",
                "grupoCodigo",
                "marcaCodigo",
                "generoCodigo",
              ].includes(f.name)
            )
            .map((filter) => (
              <div key={filter.name} className="flex-1 min-w-[250px]">
                <Label>{filter.label}</Label>
                <CheckboxForm
                  name={dataFilters?.[filter.name]}
                  checks={
                    filter.name === "locaisEstoque"
                      ? watchStocksLocationSelected
                      : filter.name === "colecaoCodigo"
                      ? watchCollectionsSelected
                      : filter.name === "linhaCodigo"
                      ? watchLinesSelected
                      : filter.name === "grupoCodigo"
                      ? watchGroupsSelected
                      : filter.name === "marcaCodigo"
                      ? watchBrandsSelected
                      : watchGenresSelected
                  }
                  data={
                    filter.data?.map((item) => ({
                      id: String(item.value),
                      label: String(item.name),
                    })) ?? []
                  }
                  control={control}
                />
              </div>
            ))}
        </GroupInput>

        <SheetFooter className="mt-auto ">
          {/* <SheetClose asChild> */}
          <DetailActionButton className="p-5" type="submit">
            Salvar
          </DetailActionButton>
          {/* </SheetClose> */}
        </SheetFooter>
      </form>
    </Form>
  );
}
