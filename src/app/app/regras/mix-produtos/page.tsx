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
import { RulesConceptListingOptionsActions } from "./_components/RulesConceptListingOptionsActions";
import { TableListRulesConcept } from "./_components/TableListRulesConcept";

export const metadata: Metadata = {
  title: "Regra mix de produtos | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

export default function HomePage() {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/mix-produtos", title: "Regra mix de produtos" },
      ]}
    >
      <ListingPage>
        <ListingHeader className="flex justify-between">
          <ListingTitle>Minhas regras de mix de produtos</ListingTitle>
          <Suspense>
            <RulesConceptListingOptionsActions />
          </Suspense>
        </ListingHeader>

        <ListingMain>
          <Tabs defaultValue="all" className="bg-background rounded-md">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="p-2">
              <Suspense>
                <TableListRulesConcept />
              </Suspense>
            </TabsContent>
          </Tabs>
        </ListingMain>
      </ListingPage>
    </Navigation>
  );
}
