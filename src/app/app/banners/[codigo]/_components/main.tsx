"use client";

import {
  DetailBox,
  DetailContent,
  DetailGoBack,
  DetailHeader,
  DetailMain,
  DetailPage,
  DetailTitle,
} from "@/components/layouts/detail";
import { ScreenLoading } from "@/components/loading-screen";
import { useBannerOne } from "@/hooks/queries/useBanners";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BannerFormCreateAndUpdate } from "../../_components/bannerFormCreateAndUpdate";

interface BannerMainProps {
  bannerId: string;
}

export function BannerMain({ bannerId }: BannerMainProps) {
  const { data: banner, isLoading, isError } = useBannerOne(bannerId);
  const { push } = useRouter();

  useEffect(() => {
    if (isError) {
      push("/app/inicio");
    }
  }, [isError]);

  if (isLoading || !banner) return <ScreenLoading />;

  return (
    <DetailPage>
      <DetailHeader>
        <DetailGoBack />
        <DetailTitle>Banner</DetailTitle>
      </DetailHeader>

      <DetailMain>
        <DetailContent>
          <DetailBox>
            <BannerFormCreateAndUpdate banner={banner} />
          </DetailBox>
        </DetailContent>
      </DetailMain>
    </DetailPage>
  );
}
