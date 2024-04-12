import { Navigation } from "@/components/navigation/nav-main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import { TableProductAll } from "./table/components/TableProductAll";

export const metadata: Metadata = {
  title: "Produtos | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

export default async function HomePage() {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/produtos", title: "produtos" },
      ]}
    >
      <div className="flex flex-col items-center w-full p-8">
        <div className="flex flex-col w-full max-w-[var(--container-max-width)]">
          <div className="text-start mb-4">
            <h2 className="text-2xl font-bold">Meus produtos</h2>
          </div>

          <div className="bg-box rounded-lg p-1">
            <Tabs defaultValue="all" className="bg-background rounded-md">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="p-2">
                <TableProductAll />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Navigation>
  );
}
