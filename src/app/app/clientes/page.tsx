import {
  ListingHeader,
  ListingMain,
  ListingPage,
  ListingTitle,
} from "@/components/layouts/listing";
import { Navigation } from "@/components/navigation/nav-main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import { Suspense } from "react";
import { TableListClient } from "./_components/TableListClient";

export const metadata: Metadata = {
  title: "Clientes | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

export default function HomePage() {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/clientes", title: "clientes" },
      ]}
    >
      <ListingPage>
        <ListingHeader>
          <ListingTitle>Meus clientes</ListingTitle>
        </ListingHeader>

        <ListingMain>
          <Tabs defaultValue="all" className="bg-background rounded-md">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="p-2">
              <Suspense>
                <TableListClient />
              </Suspense>
            </TabsContent>
          </Tabs>
        </ListingMain>
      </ListingPage>
    </Navigation>
  );
}
