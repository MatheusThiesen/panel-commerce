"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import nookies from "nookies";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputOTP } from "@/components/InputOTP";
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
import { Label } from "@/components/ui/label";
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

  const form = useForm<SessionFormProps>({
    resolver: zodResolver(sessionFormSchema),
  });

  const { register, handleSubmit } = form;

  async function handleSendMail({ email }: SessionFormProps) {
    setIsLoading(true);

    try {
      if (!isPinCode) {
        await api.post("/auth/get-pin", { email: email });
        setIsPinCode(true);
      } else {
        toast.warning("Insira o código de segurança", {
          description:
            "E necessário que informe o código de segurança que enviamos para seu e-email.",
        });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }

    nookies.set(null, "authjs.session-tokenn", "TESTE", {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
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
                <div className="grid gap-1">
                  <Label
                    className="text-slate-600 mb-1 my-2"
                    htmlFor="password"
                  >
                    Enviamos um código de segurança para seu e-mail, insira ele
                    aqui para acessar painel.
                  </Label>
                  <InputOTP {...register("pin")} />
                </div>
                <Button
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
