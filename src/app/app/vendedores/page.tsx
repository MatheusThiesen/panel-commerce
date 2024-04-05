import { Navigation } from "@/components/navigation/nav-main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendedores | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

export default function HomePage() {
  return (
    <Navigation>
      <div>Vendedores</div>
    </Navigation>
  );
}
