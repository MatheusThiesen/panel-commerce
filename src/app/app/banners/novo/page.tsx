import {
  DetailBox,
  DetailContent,
  DetailGoBack,
  DetailHeader,
  DetailMain,
  DetailPage,
  DetailTitle,
} from "@/components/layouts/detail";
import { Navigation } from "@/components/navigation/nav-main";
import { Metadata } from "next";
import { Suspense } from "react";
import { BannerFormCreateAndUpdate } from "../_components/bannerFormCreateAndUpdate";

export const metadata: Metadata = {
  title: "Banner | Panel App Alpar do Brasil",
  description: "Pagina de detalhe do banner",
};

export default async function HomePage() {
  return (
    <Navigation
      breadcrumbs={[
        { href: "/app/inicio", title: "início" },
        { href: "/app/banners", title: "banners" },
      ]}
    >
      <DetailPage>
        <DetailHeader className="justify-between">
          <div className="flex">
            <DetailGoBack />
            <DetailTitle>Novo banner</DetailTitle>
          </div>
        </DetailHeader>

        <DetailMain>
          <DetailContent>
            <DetailBox className="flex-row">
              <Suspense>
                <BannerFormCreateAndUpdate />
              </Suspense>
            </DetailBox>
          </DetailContent>
        </DetailMain>
      </DetailPage>
    </Navigation>
  );
}
