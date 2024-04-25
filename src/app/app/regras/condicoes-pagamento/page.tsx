import {
  ListingHeader,
  ListingMain,
  ListingPage,
  ListingTitle,
} from "@/components/layouts/listing";
import { Navigation } from "@/components/navigation/nav-main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";

import { RulesPaymentsConditionListingOptionsActions } from "./_components/RulesPaymentsConditionListingOptionsActions";
import { TableListRulesPaymentsCondition } from "./_components/TableListRulesPaymentsCondition";

export const metadata: Metadata = {
  title: "Condições pagamento | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

export default function HomePage() {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/condicoes-pagamento", title: "Condições pagamento" },
      ]}
    >
      <ListingPage>
        <ListingHeader className="flex justify-between">
          <ListingTitle>Minhas regras de condições pagamento</ListingTitle>
          <RulesPaymentsConditionListingOptionsActions />
        </ListingHeader>

        <ListingMain>
          <Tabs defaultValue="all" className="bg-background rounded-md">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="p-2">
              <TableListRulesPaymentsCondition />
            </TabsContent>
          </Tabs>
        </ListingMain>
      </ListingPage>
    </Navigation>
  );
}
