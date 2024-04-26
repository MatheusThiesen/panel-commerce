import { Navigation } from "@/components/navigation/nav-main";
import { Metadata } from "next";
import { ClientMain } from "./_components/main";

export const metadata: Metadata = {
  title: "Clientes | Panel App Alpar do Brasil",
  description: "Pagina de detalhe de clientes",
};

type Props = {
  params: { codigo: string };
};

export default async function HomePage({ params }: Props) {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/clientes", title: "clientes" },
      ]}
    >
      <ClientMain clientCode={+params.codigo} />
    </Navigation>
  );
}
