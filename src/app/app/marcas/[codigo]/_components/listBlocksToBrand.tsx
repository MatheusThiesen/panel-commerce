"use client";

import { DetailBox, DetailBoxTitle } from "@/components/layouts/detail";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBlocksBrand } from "@/hooks/queries/useBlocksBrand";
import { Brand } from "@/hooks/queries/useBrands";
import { api } from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { CreateBlockBrandForm } from "./createBlockBrandForm";

interface ListBlocksToBrandProps {
  brand: Brand;
}

export function ListBlocksToBrand({ brand }: ListBlocksToBrandProps) {
  const { data, refetch } = useBlocksBrand({ brandCode: brand.codigo });
  const queryClient = useQueryClient();

  async function deleteBlock(blockId: string) {
    await api.delete(`/panel/brands/blocks/${blockId}`);

    return blockId;
  }

  const { mutateAsync: deleteBrandFn } = useMutation({
    mutationFn: deleteBlock,
    onSuccess(_blockId: string) {
      queryClient.invalidateQueries({
        queryKey: ["brands-blocks"],
      });
    },
  });

  async function handleDeleteBlockToBrand(blockId: string) {
    try {
      await deleteBrandFn(blockId);
      toast.success("Bloqueio removido com sucesso", {
        description: "O bloqueio foi removido com sucesso.",
      });
      refetch();
    } catch (error) {
      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    }
  }

  return (
    <DetailBox className="pb-8 mb-6">
      <div className="flex items-center ">
        <DetailBoxTitle>Estados bloqueados</DetailBoxTitle>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="ml-4 p-2">
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col justify-between items-start">
            <DialogHeader className="mb-6">
              <DialogTitle>Criar bloqueio de UF</DialogTitle>
            </DialogHeader>

            <CreateBlockBrandForm brand={brand} blocks={data?.blocks ?? []} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        {(data?.blocks.length ?? 0) <= 0 && (
          <TableCaption>Não há dados a serem exibidos</TableCaption>
        )}

        <TableHeader>
          <TableRow>
            <TableHead className="text-center">UF</TableHead>
            <TableHead className="text-center">AÇÃO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.blocks?.map((block) => (
            <TableRow key={block.id}>
              <TableCell className="text-center">{block.estado.uf}</TableCell>
              <TableCell className="text-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" type="button">
                      <Trash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação excluirá o bloqueio do estado{" "}
                        {block.estado.uf} para marca {brand.descricao}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteBlockToBrand(block.id)}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DetailBox>
  );
}
