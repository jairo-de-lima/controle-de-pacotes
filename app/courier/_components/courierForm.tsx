"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Courier } from "@prisma/client";
import { createOrUpdateCourier } from "@/app/_actions/_courier-actions/courier";
import { Button } from "@/app/_components/ui/button";
import AuthGuard from "@/app/_components/AuthGuard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/app/_components/ui/card";
import { PlusCircle, UserRoundPen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import GetCourier from "./GetPerson";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { MoneyInput } from "./money-input";
import { useSession } from "next-auth/react";
import { useToast } from "@/app/_hooks/use-toast";

const courierSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  pricePerPackage: z.number().positive("Valor deve ser positivo"),
});

interface CourierFormProps {
  initialData?: Courier;
}

export function CourierForm({ initialData }: CourierFormProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof courierSchema>>({
    resolver: zodResolver(courierSchema),
    defaultValues: {
      name: initialData?.name || "",
      pricePerPackage: initialData?.pricePerPackage || 0,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof courierSchema>> = async (
    data,
  ) => {
    setIsSubmitting(true);
    try {
      const result = await createOrUpdateCourier({
        ...data,
        id: initialData?.id,
        companyId: session?.user?.id || "",
      });

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Entregador registrado com sucesso!",
          duration: 2000,
        });
        form.reset();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error submitting courier form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCourierSelect = (courier: Courier) => {
    form.setValue("name", courier.name);
    form.setValue("pricePerPackage", courier.pricePerPackage);
    setIsOpen(false);
  };

  return (
    <AuthGuard>
      <Card className="flex min-h-screen items-center justify-center">
        <CardContent className="m-2 flex w-full max-w-md flex-col rounded-lg border bg-background p-4 shadow-md">
          <CardTitle className="flex items-center justify-between">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <PlusCircle className="h-6 w-6" />
              Cadastro de Entregadores
            </h2>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost">
                  <UserRoundPen size={18} />
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Selecionar Entregador</DialogTitle>
                  <DialogDescription>
                    Escolha um entregador existente ou edite suas informações.
                  </DialogDescription>
                </DialogHeader>

                <GetCourier onSelect={handleCourierSelect} />
              </DialogContent>
            </Dialog>

            {/* <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserRoundPen size={18} />
                  <CourierButtons onSelectCourier={handleCourierSelect} />
                </Button>
              </DialogTrigger>
            </Dialog> */}

            {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost">
                  <UserRoundPen size={18} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <GetCourier onSelect={handleCourierSelect} />
              </DialogContent>
            </Dialog> */}
          </CardTitle>
          <CardDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                <CardFooter className="flex justify-between gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {initialData ? "Atualizar" : "Criar"} Entregador
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardDescription>
        </CardContent>
      </Card>
    </AuthGuard>
  );
}
