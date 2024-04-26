import { Navigation } from "@/components/navigation/nav-main";
import { Metadata } from "next";
import { OrderMain } from "./_components/main";

export const metadata: Metadata = {
  title: "Pedido | Panel App Alpar do Brasil",
  description: "Pagina de detalhe do pedido",
};

type Props = {
  params: { codigo: string };
};

export default async function HomePage({ params }: Props) {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/pedidos", title: "pedidos" },
      ]}
    >
      <OrderMain orderCode={+params.codigo} />
    </Navigation>
  );
}
