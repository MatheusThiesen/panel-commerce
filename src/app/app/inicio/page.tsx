import { Navigation } from "@/components/navigation/nav-main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Início | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

export default function HomePage() {
  return (
    <Navigation breadcrumbs={[{ href: "/app/inicio", title: "início" }]}>
      <div className="w-full flex flex-col items-center">
        <div className="py-12 px-8 w-full max-w-[var(--container-max-width)] flex flex-col">
          <h2 className="text-3xl font-bold">Olá, Ti Alpar Do Brasil!</h2>

          {/* <div className="mt-16 text-xl font-bold">
            <h2>Acesso rápido</h2> */}
          {/* BOX COM ACESSOS RÁPIDOS */}
          {/* </div> */}

          {/* <div className="mt-8 text-xl font-bold">
            <h2>Confira seus pedidos</h2> */}
          {/* DESTACAR INFORMAÇÕES RELEVANTES DE PEDIDOS (PEDIDOS PENDENTES DIFERENCIADOS, PEDIDOS NAO INTEGRADOS, TOTAL PEDIDOS ) */}
          {/* </div> */}

          {/* <div className="mt-8 text-xl font-bold">
            <h2>Total de vendas</h2> */}
          {/* GRÁFICO POR DIA NOS ULTIMOS 30 DIAS COM SITUAÇÕES DE VENDA  */}
          {/* </div> */}
        </div>
      </div>
    </Navigation>
  );
}
