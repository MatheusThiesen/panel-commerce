import { Navigation } from "@/components/navigation/nav-main";
import { Metadata } from "next";
import { BrandMain } from "./_components/main";

export const metadata: Metadata = {
  title: "Marcas | Panel App Alpar do Brasil",
  description: "Pagina de detalhe de Marcas",
};

type Props = {
  params: { codigo: string };
};

export default async function HomePage({ params }: Props) {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/marcas", title: "Marcas" },
      ]}
    >
      <BrandMain brandCode={+params.codigo} />
    </Navigation>
  );
}
