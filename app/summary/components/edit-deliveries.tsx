"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
} from "@/app/_components/ui/form";
import { Calendar } from "@/app/_components/ui/calendar";
import { z } from "zod";
import { useToast } from "@/app/_hooks/use-toast";
import { DialogClose } from "@/app/_components/ui/dialog"; // Importando os componentes do Dialog
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { cn } from "@/app/_lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { MoneyInput } from "@/app/courier/_components/money-input";

// Validação do formulário com Zod
const deliverySchema = z.object({
  date: z.date(),
  packages: z.number().min(1, "Deve haver pelo menos um pacote."),
  additionalFee: z.number(),
  totalValue: z.number(),
});

type DeliveryFormValues = z.infer<typeof deliverySchema>;

// Tipagem das propriedades do componente
type EditDeliveryProps = {
  delivery: {
    id: string;
    date?: Date;
    packages?: number;
    additionalFee?: number;
    totalValue?: number;
  };
  onDeliveryUpdated: () => void; // Função para ser chamada após a atualização
};

export function EditDelivery({
  delivery,
  onDeliveryUpdated,
}: EditDeliveryProps) {
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditingState, setIsEditingState] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // Controlando a visibilidade do modal
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOpen, setIsOpen] = useState(false);

  // Inicialização do formulário com valores padrão
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      date: delivery.date,
      packages: delivery.packages,
      additionalFee: delivery.additionalFee,
      totalValue: delivery.totalValue,
    },
  });

  // Função para lidar com o envio do formulário
  async function onSubmit(values: z.infer<typeof deliverySchema>) {
    try {
      // Enviar os dados para a API
      const response = await fetch(`/api/deliveries/${delivery.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Erro ao editar a entrega.");
      }

      // Atualizar a lista de entregas
      onDeliveryUpdated();

      // Exibir mensagem de sucesso
      toast({
        title: "Sucesso",
        description: "Entrega editada com sucesso.",
        duration: 2000,
      });

      // Fechar o modal
      setIsOpen(false);
    } catch (error) {
      console.error(error);

      toast({
        title: "erro",
        description: "Houve um erro ao editar a entrega.",
        duration: 2000,
      });
    } finally {
      setIsEditingState(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
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
                      onSelect={(selectedDate) => {
                        field.onChange(selectedDate);
                        setIsCalendarOpen(false);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1990-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Pacotes</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...form.register("packages", { valueAsNumber: true })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Valor Adicional</FormLabel>
            <FormControl>
              <MoneyInput
                placeholder="Digite o valor"
                value={delivery.additionalFee}
                onValueChange={({ floatValue }) =>
                  form.setValue("additionalFee", floatValue ?? 0)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <Button type="submit">Salvar</Button>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
        </form>
      </Form>
    </div>
  );
}
