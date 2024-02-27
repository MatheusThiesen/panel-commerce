import { Navigation } from "@/components/navigation/nav-main";
import { Metadata } from "next";
import { columns } from "./test/components/columns";
import { DataTable } from "./test/components/data-table";

export const metadata: Metadata = {
  title: "Produtos | Panel App Alpar do Brasil",
  description: "Pagina de inicio da ferramenta",
};

export default async function HomePage() {
  return (
    <Navigation>
      <div className="flex flex-col items-center w-full p-8">
        <div className="flex flex-col w-full max-w-[var(--container-max-width)]">
          <div className="text-start mb-4">
            <h2 className="text-2xl font-bold">Meus produtos</h2>
          </div>

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
        </div>
      </div>
    </Navigation>
  );
}
