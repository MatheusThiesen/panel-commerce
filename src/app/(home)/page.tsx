import { Metadata } from "next";

import { Icons } from "@/components/icons";
import { UserAuthForm } from "./_components/user-auth-form";

export const metadata: Metadata = {
  title: "Login | Panel App Alpar do Brasil",
  description: "Pagina de login para realizar acesso a ferramenta",
};

export default function AuthenticationPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden bg-slate-50">
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-red-600" />
        <div className="relative z-20 flex items-center text-lg font-medium text-slate-50">
          <Icons.logoShort className="mr-2 size-6" fill="#fff" />
          Alpar do Brasil
        </div>
        <div className="relative z-20 mt-auto mb-auto pb-32">
          <h1 className="text-4xl pr-44">
            Acessar o painel de controle do App Alpar do brasil.
          </h1>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full h-screen flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="w-60 mb-5 mx-auto " fill="#d0222c" />

            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Acessar
            </h2>

            <p className="text-sm text-muted-foreground">
              Realizar seu acesso no painel de controle abaixo
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
