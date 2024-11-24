"use client";

import AuthGuard from "@/app/_components/AuthGuard";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { cn } from "@/app/_lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Package } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateDeliveries } from "../_actions/deliveries-form";

const DeliveriesForm = () => {
  const { data: session } = useSession();

  const formSchema = z.object({
    date: z.date({
      required_error: "Necessario fornecer a data",
    }),
    packages: z.number({
      required_error: "O valor é obrigatório",
    }),
    additionalFee: z.number({
      required_error: "O valor é obrigatório",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      packages: 0,
      additionalFee: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await CreateDeliveries({
        ...values,
        companyId: session?.user?.id || "",
      });
      console.log(values);
      alert(response.message);
      form.reset();
    } catch (error) {
      console.error(error);
      alert(error.message || "Erro ao cadastrar entregador. Tente novamente.");
    }
  }

  // const onSubmit = (values: z.infer<typeof formSchema>) => {
  //   console.log(values);
  //   alert("Form submitted");
  // };

  return (
    <AuthGuard>
      <Card className="bg-muted-foreground-foreground flex w-[80%] flex-col items-center justify-center">
        <CardTitle className="mt-5 flex items-center gap-2">
          <Package size={18} />
          Registro de Entrega
        </CardTitle>
        <CardDescription>adicione as entregas diarias aqui</CardDescription>
        <CardContent className="mt-5 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", {
                                locale: ptBR,
                              })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("01-01-1990")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="packages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pacotes</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Quantidade de pacotes"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor por pacote</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o valor"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
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
        </CardContent>
      </Card>
    </AuthGuard>
  );
};

export default DeliveriesForm;
