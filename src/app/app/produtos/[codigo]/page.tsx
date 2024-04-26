import { Navigation } from "@/components/navigation/nav-main";
import { Metadata } from "next";
import { ProductMain } from "./_components/main";

export const metadata: Metadata = {
  title: "Produtos | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

type Props = {
  params: { codigo: string };
};

export default async function HomePage({ params }: Props) {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/produtos", title: "produtos" },
      ]}
    >
      <ProductMain productCode={+params.codigo} />
    </Navigation>
  );
}
