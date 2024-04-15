import {
  ListingHeader,
  ListingMain,
  ListingPage,
  ListingTitle,
} from "@/components/layouts/listing";
import { Navigation } from "@/components/navigation/nav-main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import { TableListProduct } from "./components/TableListProduct";

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
      <ListingPage>
        <ListingHeader>
          <ListingTitle>Meus produtos</ListingTitle>
        </ListingHeader>

        <ListingMain>
          <Tabs defaultValue="all" className="bg-background rounded-md">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="p-2">
              <TableListProduct />
            </TabsContent>
          </Tabs>
        </ListingMain>
      </ListingPage>
    </Navigation>
  );
}
