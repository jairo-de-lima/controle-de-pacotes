"use client";

import { PlusCircle } from "lucide-react";
import { Input } from "@/app/_components/ui/input";
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

const PersonForm = () => {
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "O Nome é obrigatório",
    }),
    amount: z
      .number({
        required_error: "O valor é obrigatório",
      })
      .positive({
        message: "O valor é obrigatório",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    form.reset();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted-foreground-foreground">
      <div className="flex flex-col bg-background p-4 m-2 border rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <PlusCircle className="w-6 h-6" />
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
              name="amount"
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
            <div className="flex gap-1 justify-between">
              <Button asChild>
                <a href={"/"}>Cancelar</a>
              </Button>
              <Button type="submit">Adicionar</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PersonForm;
