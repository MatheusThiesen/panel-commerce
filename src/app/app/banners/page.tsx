import {
  ListingActionButton,
  ListingHeader,
  ListingMain,
  ListingPage,
  ListingTitle,
} from "@/components/layouts/listing";
import { Navigation } from "@/components/navigation/nav-main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { TableListBanner } from "./_components/TableListBanner";

export const metadata: Metadata = {
  title: "Banners | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

export default function HomePage() {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/banners", title: "Banners" },
      ]}
    >
      <ListingPage>
        <ListingHeader>
          <ListingTitle>Meus Banners</ListingTitle>

          <ListingActionButton>
            <Link href="/app/banners/novo" className="flex">
              <Plus className="mr-2 size-4" />
              Criar
            </Link>
          </ListingActionButton>
        </ListingHeader>

        <ListingMain>
          <Tabs defaultValue="all" className="bg-background rounded-md">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="p-2">
              <Suspense>
                <TableListBanner />
              </Suspense>
            </TabsContent>
          </Tabs>
        </ListingMain>
      </ListingPage>
    </Navigation>
  );
}
