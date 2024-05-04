import { Navigation } from "@/components/navigation/nav-main";
import { Metadata } from "next";
import { HomeMain } from "./_components/main";

export const metadata: Metadata = {
  title: "Início | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

export default function HomePage() {
  return (
    <Navigation breadcrumbs={[{ href: "/app/inicio", title: "início" }]}>
      <HomeMain />
    </Navigation>
  );
}
