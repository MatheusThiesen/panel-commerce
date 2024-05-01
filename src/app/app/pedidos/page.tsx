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
import { TableListOrder } from "./_components/TableListOrder";

export const metadata: Metadata = {
  title: "Pedidos | Panel App Alpar do Brasil",
  description: "Listagem de pedidos",
};

export default function HomePage() {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/pedidos", title: "pedidos" },
      ]}
    >
      <ListingPage>
        <ListingHeader>
          <ListingTitle>Meus pedidos</ListingTitle>
        </ListingHeader>

        <ListingMain>
          <Tabs defaultValue="all" className="bg-background rounded-md">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="p-2">
              <Suspense>
                <TableListOrder />
              </Suspense>
            </TabsContent>
          </Tabs>
        </ListingMain>
      </ListingPage>
    </Navigation>
  );
}
