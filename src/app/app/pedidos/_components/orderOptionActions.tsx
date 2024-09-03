"use client";

import { DetailOptionsActions } from "@/components/layouts/detail";
import { Order } from "@/hooks/queries/useOrders";
import { api } from "@/services/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type OrderOptionActionsProps = {
  order: Order;
};

export function OrderOptionActions({ order }: OrderOptionActionsProps) {
  const queryClient = useQueryClient();

  async function handleResendOrder() {
    try {
      await api.post(`/panel/orders/resend/${order.codigo}`);
      toast.info("Reenviando pedido...", {
        description:
          "Estamos reenviar o pedido. Por favor, aguarde este processo pode demorar um pouco.",
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["order", order.codigo],
      });
    } catch (error) {
      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    }
  }

  if (order.situacaoPedido.codigo === 5) {
    return (
      <DetailOptionsActions
        data={[
          {
            description: "Reenviar pedido",
            handle: handleResendOrder,
          },
        ]}
      />
    );
  } else {
    return <div></div>;
  }
}
