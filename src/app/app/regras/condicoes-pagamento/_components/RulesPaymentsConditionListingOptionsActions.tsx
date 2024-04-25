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
import { getRulesPaymentsCondition } from "@/hooks/queries/useRulesPaymentsCondition";
import { exportXlsx } from "@/lib/export-xlsx";
import { api } from "@/services/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import { File as FileIcon, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function RulesPaymentsConditionListingOptionsActions() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const orderby = searchParams.get("orderby");
  const search = searchParams.get("search");

  const [isShowImportData, setIsShowImportData] = useState(false);
  const [file, setFile] = useState<File>();

  async function exportDataToXlsx() {
    const rules = await getRulesPaymentsCondition({
      page: 1,
      pagesize: 9999,
      orderby: orderby ?? undefined,
      search: search ?? undefined,
    });

    await exportXlsx({
      filename: "regras-condições-pagamento.xlsx",
      data: rules.rules.map((rule) => ({
        "Cód. condição pagamento": rule.condicaoPagamento.codigo,
        "Condição pagamento": rule.condicaoPagamento.descricao,
        "Cód. marca": rule.marca.codigo,
        Marca: rule.marca.descricao,
        "Lista preço": rule.listaPrecoCodigo,
        "Cód. local cobrança": rule.localCobranca.codigo,
        "Local cobrança": rule.localCobranca.descricao,
        "Valor mínimo": rule.valorMinimo,
        Ativo: rule.eAtivo ? "Sim" : "Não",
        Diferenciado: rule.eApenasDiferenciado ? "Sim" : "Não",
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
      await api.post(`/payment-conditions-rules/import`, formData);

      queryClient.invalidateQueries({
        queryKey: ["rules-payments-condition"],
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
            <AlertDialogTitle>
              Importação de condição de pagamentos
            </AlertDialogTitle>
            <AlertDialogDescription>
              <p className="font-bold ">
                *Apenas arquivos .csv sem cabeçalho e deve estar na ordem
                (Cód.condição pagamento | Cód.marca | Lista preço | Cód.local
                cobrança | Valor mínimo | Ativo | Diferenciado )
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
