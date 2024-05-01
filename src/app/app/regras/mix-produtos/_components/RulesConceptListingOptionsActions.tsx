"use client";

import { Dropzone } from "@/components/Dropzone";
import { ListingOptionsActions } from "@/components/layouts/listing";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getRulesConcept } from "@/hooks/queries/useRulesConcepts";
import { exportXlsx } from "@/lib/export-xlsx";
import { api } from "@/services/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import { File as FileIcon, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function RulesConceptListingOptionsActions() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const search = searchParams.get("search");

  const [isShowImportData, setIsShowImportData] = useState(false);
  const [file, setFile] = useState<File>();

  async function exportDataToXlsx() {
    const rules = await getRulesConcept({
      page: 1,
      pagesize: 9999,
      search: search ?? undefined,
    });

    await exportXlsx({
      filename: "regras-mix-produtos.xlsx",
      data: rules.rules.map((rule) => ({
        "cod.conceito": rule.conceito.codigo,
        conceito: rule.conceito.descricao,
        "cod.grupo": rule.subGrupo.grupo.codigo,
        grupo: rule.subGrupo.grupo.descricao,
        "cod.subgrupo": rule.subGrupo.codigo,
        subgrupo: rule.subGrupo.descricao,
      })),
    });
  }

  async function handleExportData() {
    try {
      toast.promise(exportDataToXlsx, {
        loading: "Carregando informações...",
        success: "Dados exportados com sucesso.",
        error:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    } catch (error) {
      console.log(error);

      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    }
  }

  async function importDataToXlsx() {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await api.post(`/product-concept-rules/import`, formData);

      queryClient.invalidateQueries({
        queryKey: ["rules-concepts"],
      });

      setIsShowImportData(false);
      setFile(undefined);
    }
  }

  async function handleImportDataToXlsx() {
    if (!file) {
      return toast.warning("Nenhum arquivo anexado.", {
        description: "É necessário anexar o arquivo.",
      });
    }

    toast.promise(importDataToXlsx, {
      loading: "Importando informações...",
      success: "Dados importados com sucesso.",
      error: "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
    });
  }

  async function handleImportData() {
    try {
      setIsShowImportData(true);
    } catch (error) {
      console.log(error);

      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    }
  }

  return (
    <>
      <ListingOptionsActions
        data={[
          { description: "Exportar", handle: handleExportData },
          { description: "Importar", handle: handleImportData },
        ]}
      />

      <AlertDialog open={isShowImportData} onOpenChange={setIsShowImportData}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Importação de mix de produtos</AlertDialogTitle>
            <AlertDialogDescription>
              Este processo considerará apenas o mix de produtos contido no
              arquivo de importação, as demais regras serão excluídas.
              <p className="font-bold mt-2">
                *Apenas arquivos .csv sem cabeçalho e deve estar na ordem
                (Cód.Conceito | Cód.Grupo | Cód.Subgrupo )
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {!file && (
            <Dropzone
              onFileUploaded={(files) => {
                setFile(files[0]);
              }}
              accept={{ "text/csv": [], "application/csv": [] }}
            />
          )}

          {file && (
            <div className="flex items-center justify-between bg-panel rounded-md p-2">
              <div className="flex items-center">
                <FileIcon className="size-8 mr-2" />
                <span>{file.name}</span>
              </div>

              <Button
                variant="link"
                type="button"
                onClick={() => {
                  setFile(undefined);
                }}
              >
                <X />
              </Button>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="default" onClick={handleImportDataToXlsx}>
              Importar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
