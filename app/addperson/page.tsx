"use client";

import { PlusCircle } from "lucide-react";
import { Input } from "../_components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../_components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../_components/ui/button";
import { MoneyInput } from "./_components/money-input";
import AuthGuard from "../_components/AuthGuard";
import { useSession } from "next-auth/react";
import { createCourier } from "./_actions/courier";
// import toast from "react-hot-toast";
import { useToast } from "../_hooks/use-toast";

const PersonForm = () => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(2),
    pricePerPackage: z.number().positive({
      message: "O valor é obrigatório",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      pricePerPackage: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await createCourier({
        ...values,
        companyId: session?.user?.id || "", // Passa o ID da empresa
      });
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "O novo entregador foi criado com sucesso",
          duration: 2000,
        });
      }
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Opss...",
        description: "Ocorreu um erro ao criar o novo entregador",
        duration: 2000,
      });
    }
  }

  return (
    <AuthGuard>
      <div className="bg-muted-foreground-foreground flex min-h-screen items-center justify-center">
        <div className="m-2 flex w-full max-w-md flex-col rounded-lg border bg-background p-4 shadow-md">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <PlusCircle className="h-6 w-6" />
            Cadastro de Entregadores
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricePerPackage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor por pacote</FormLabel>
                    <FormControl>
                      <MoneyInput
                        placeholder="Digite o valor"
                        value={field.value}
                        onValueChange={({ floatValue }) =>
                          field.onChange(floatValue)
                        }
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between gap-1">
                <Button asChild>
                  <a href={"/"}>Cancelar</a>
                </Button>
                <Button type="submit">Adicionar</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AuthGuard>
  );
};

export default PersonForm;
