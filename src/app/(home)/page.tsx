import { Metadata } from "next";

import { Icons } from "@/components/icons";
import { SelectTheme } from "@/components/select-theme";
import { UserAuthForm } from "./_components/user-auth-form";

export const metadata: Metadata = {
  title: "Login | Panel App Alpar do Brasil",
  description: "Pagina de login para realizar acesso a ferramenta",
};

export default function AuthenticationPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
      <SelectTheme className="absolute right-4 top-4 md:right-8 md:top-8" />

      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-red-600" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logoShort className="mr-2 size-6 " fill="#fff" />
          Alpar do Brasil
        </div>
        <div className="relative z-20 mt-auto mb-auto pb-32">
          <Icons.logo className="w-80 mb-5 mx-auto " fill="white" />
          <p className="text-4xl pr-44">
            Acessar o painel de controle o App Alpar do brasil.
          </p>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full h-screen flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Acessar</h1>
            <p className="text-sm text-muted-foreground">
              Realizar seu acesso com seu logo abaixo
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
