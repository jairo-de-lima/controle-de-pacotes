"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Input } from "../_components/ui/input";
import { Button } from "../_components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../_components/ui/form";
import { useState } from "react";
import { LogInIcon } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Define o schema de validação com Zod
  const formSchema = z.object({
    email: z.string().email("Insira um e-mail válido."),
    password: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      console.error("Erro de autenticação:", result.error);
    } else {
      router.push("/"); // Redireciona após login bem-sucedido
    }
  };

  return (
    <div className="bg-muted-foreground-foreground flex min-h-screen flex-col items-center justify-center p-1">
      <Card className="w-full md:w-[50%]">
        <CardHeader>
          <CardTitle>Faça Login</CardTitle>
          <CardDescription>
            Faça login para utilizar a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Campo de Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Digite seu e-mail"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de Senha */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"} // Alterna entre texto e senha
                          placeholder="Digite sua senha"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowPassword(!showPassword)} // Alterna visibilidade da senha
                          className="absolute right-2 top-1/2 -translate-y-1/2 border-none bg-transparent hover:bg-transparent"
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </Button>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botão de Enviar */}
              <div className="flex justify-end">
                <Button type="submit">
                  <LogInIcon size={16} />
                  Entrar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
