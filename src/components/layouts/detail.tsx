"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ClassNameValue } from "tailwind-merge";
import { Button } from "../ui/button";

type DetailPageProps = {
  children: ReactNode;
};
export const DetailPage = ({ children }: DetailPageProps) => {
  return (
    <div className="flex flex-col items-center w-full p-8">
      <div className="flex flex-col w-full max-w-[var(--container-max-width)]">
        {children}
      </div>
    </div>
  );
};

type DetailHeaderProps = {
  children?: ReactNode;
};
export const DetailHeader = ({ children }: DetailHeaderProps) => {
  return <div className="text-start mb-4 flex">{children}</div>;
};

type DetailTitle = {
  children?: ReactNode;
};
export const DetailTitle = ({ children }: DetailTitle) => {
  return <h2 className="text-2xl font-bold">{children}</h2>;
};

export const DetailGoBack = () => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="mr-4"
      type="button"
      onClick={() => {
        router.back();
      }}
    >
      <ArrowLeft />
    </Button>
  );
};

type DetailMainProps = {
  children?: ReactNode;
};
export const DetailMain = ({ children }: DetailMainProps) => {
  return <div className="bg-box rounded-lg">{children}</div>;
};

type DetailContentProps = {
  secondaryColumn?: ReactNode;
  children?: ReactNode;
};
export const DetailContent = ({
  secondaryColumn,

  children,
}: DetailContentProps) => {
  return (
    <div className="flex w-full justify-between flex-wrap gap-5">
      {!secondaryColumn ? (
        children
      ) : (
        <>
          <div className="w-full max-w-full lg:max-w-[65.5%] flex flex-col">
            {children}
          </div>
          <div className="w-full  max-w-full lg:max-w-[32%] flex flex-col gap-y-6">
            {secondaryColumn}
          </div>
        </>
      )}
    </div>
  );
};

type DetailBoxProps = {
  children?: ReactNode;
  className?: ClassNameValue;
};
export const DetailBox = ({ children, className }: DetailBoxProps) => {
  return (
    <div
      className={cn(
        "w-full bg-background rounded-md flex flex-col justify-between p-5 gap-y-3",
        className
      )}
    >
      {children}
    </div>
  );
};

type DetailBoxTitleProps = {
  children: string;
  className?: ClassNameValue;
};
export const DetailBoxTitle = ({
  children,
  className,
}: DetailBoxTitleProps) => {
  return (
    <h3 className={cn("font-bold text-slate-800 text-lg mb-1", className)}>
      <span>{children}</span>
    </h3>
  );
};
