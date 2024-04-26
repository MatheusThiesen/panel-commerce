import { Navigation } from "@/components/navigation/nav-main";
import { Metadata } from "next";
import { SellerMain } from "./_components/main";

export const metadata: Metadata = {
  title: "Vendedores | Panel App Alpar do Brasil",
  description: "Pagina de detalhe do vendedor",
};

type Props = {
  params: { codigo: string };
};

export default async function HomePage({ params }: Props) {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/vendedor", title: "vendedor" },
      ]}
    >
      <SellerMain sellerCode={+params.codigo} />
    </Navigation>
  );
}
