"use client";

import { ReactNode } from "react";

type ListingPageProps = {
  children: ReactNode;
};
export const ListingPage = ({ children }: ListingPageProps) => {
  return (
    <div className="flex flex-col items-center w-full px-8 py-5">
      <div className="flex flex-col w-full max-w-[var(--container-max-width)] pb-10">
        {children}
      </div>
    </div>
  );
};

type ListingHeaderProps = {
  children?: ReactNode;
};
export const ListingHeader = ({ children }: ListingHeaderProps) => {
  return <div className="text-start mb-4 flex">{children}</div>;
};

type ListingTitle = {
  children?: ReactNode;
};
export const ListingTitle = ({ children }: ListingTitle) => {
  return <h2 className="text-2xl font-bold">{children}</h2>;
};

type ListingMainProps = {
  children?: ReactNode;
};
export const ListingMain = ({ children }: ListingMainProps) => {
  return <div className="bg-box rounded-lg">{children}</div>;
};
