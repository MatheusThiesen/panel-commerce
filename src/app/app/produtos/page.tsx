import { Navigation } from "@/components/navigation/nav-main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import { columns } from "./test/components/columns";
import { DataTable } from "./test/components/data-table";

export const metadata: Metadata = {
  title: "Produtos | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

export default async function HomePage() {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/inicio", title: "início" },
        { href: "/produtos", title: "produtos" },
      ]}
    >
      <div className="flex flex-col items-center w-full p-8">
        <div className="flex flex-col w-full max-w-[var(--container-max-width)]">
          <div className="text-start mb-4">
            <h2 className="text-2xl font-bold">Meus produtos</h2>
          </div>

          <div className="bg-box rounded-lg p-1">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="a">Ativos</TabsTrigger>
                <TabsTrigger value="v">Inativos</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="p-2">
                <DataTable
                  data={[
                    {
                      id: "1",
                      label: "teste",
                      priority: "1",
                      status: "1",
                      title: "teste",
                    },
                  ]}
                  columns={columns}
                />
              </TabsContent>
              <TabsContent value="password">
                Change your password here.
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Navigation>
  );
}
