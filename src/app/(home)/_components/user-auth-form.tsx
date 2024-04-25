"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputOTP } from "@/components/form/InputOTP";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/services/apiClient";
import { toast } from "sonner";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const sessionFormSchema = z.object({
  email: z
    .string({ required_error: "Informe seu endereço de e-mail" })
    .email("Por favor, insira um endereço de e-mail válido."),
  pin: z.string().optional(),
});

type SessionFormProps = z.infer<typeof sessionFormSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isPinCode, setIsPinCode] = React.useState<boolean>(false);
  const router = useRouter();

  const form = useForm<SessionFormProps>({
    resolver: zodResolver(sessionFormSchema),
  });

  const { handleSubmit, watch } = form;

  const pinWatch = watch("pin");

  async function handleSendMail({ email }: SessionFormProps) {
    setIsLoading(true);

    try {
      if (!isPinCode) {
        await api.post("/auth/get-pin", { email: email });
        setIsPinCode(true);
      } else {
        if (pinWatch && pinWatch.length >= 8) {
          try {
            const getSession = await api.post<{
              access_token: string;
              refresh_token: string;
            }>("/auth/session", { email: email, pin: pinWatch });

            const { access_token, refresh_token } = getSession.data;

            nookies.set(null, "auth.session-token", access_token, {
              maxAge: 30 * 24 * 60 * 60,
              path: "/",
            });
            nookies.set(null, "auth.session-refresh", refresh_token, {
              maxAge: 30 * 24 * 60 * 60,
              path: "/",
            });

            window.location.reload();

            router.push("/app/inicio");
          } catch (error) {
            toast.warning("Código de segurança inválido", {
              description:
                "É necessário informar o código de segurança que enviamos para o seu e-mail.",
            });
          }
        } else {
          toast.warning("Insira o código de segurança", {
            description:
              "E necessário que informe o código de segurança que enviamos para seu e-email.",
          });
        }
      }
    } catch (error) {
      toast.error("Erro interno", {
        description:
          "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleSendMail)}>
          <div className="grid gap-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-slate-900"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isPinCode && (
              <Button
                type="submit"
                disabled={isLoading}
                className="mt-3 bg-red-600 text-white hover:bg-red-700"
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Entrar
              </Button>
            )}

            {isPinCode && (
              <>
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900">
                        E- Enviamos um código de segurança para seu e-mail,
                        insira ele aqui para acessar painel.
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          name={field.name}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          className="text-slate-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <div className="grid gap-1">
                  <Label
                    className="text-slate-600 mb-1 my-2"
                    htmlFor="password"
                  >
                    Enviamos um código de segurança para seu e-mail, insira ele
                    aqui para acessar painel.
                  </Label>
                  <InputOTP {...register("pin")} />
                </div> */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-3 bg-red-600 text-white hover:bg-red-700"
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Entrar
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
