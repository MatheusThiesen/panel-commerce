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
import { TableListDiscountAuthority } from "./_components/TableListDiscountAuthority";

export const metadata: Metadata = {
  title: "Alçada desconto | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

export default function HomePage() {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/alcada-desconto", title: "Alçada desconto" },
      ]}
    >
      <ListingPage>
        <ListingHeader className="flex justify-between">
          <ListingTitle>Alçada desconto</ListingTitle>
        </ListingHeader>

        <ListingMain>
          <Tabs defaultValue="all" className="bg-background rounded-md">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="p-2">
              <Suspense>
                <TableListDiscountAuthority />
              </Suspense>
            </TabsContent>
          </Tabs>
        </ListingMain>
      </ListingPage>
    </Navigation>
  );
}
