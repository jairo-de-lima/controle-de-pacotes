import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { CalendarIcon, Package } from "lucide-react";
import { cn } from "@/app/_lib/utils";
import CourierButtons from "./searchCourier";
import { CreateDeliveries } from "../_actions/deliveries-form";
import AuthGuard from "@/app/_components/AuthGuard";

const DeliveriesForm = () => {
  const { data: session } = useSession();

  // Estado para armazenar o entregador selecionado
  const [selectedCourier, setSelectedCourier] = useState(null);

  const formSchema = z.object({
    date: z.date({
      required_error: "Necessário fornecer a data",
    }),
    packages: z
      .number({
        required_error: "A quantidade de pacotes é obrigatória",
      })
      .positive("A quantidade de pacotes deve ser maior que zero"),
    additionalFee: z.number({
      required_error: "O valor adicional é obrigatório",
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
    if (!selectedCourier) {
      alert("Por favor, selecione um entregador antes de enviar!");
      return;
    }

    try {
      const response = await CreateDeliveries({
        ...values,
        companyId: session?.user?.id || "",
        courierId: selectedCourier.id, // Usa o ID do entregador selecionado
      });

      alert(response.message);
      form.reset();
      setSelectedCourier(null); // Limpa o entregador selecionado após o envio
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar entrega. Tente novamente.");
    }
  }

  return (
    <AuthGuard>
      <Card className="bg-muted-foreground-foreground flex w-[80%] flex-col items-center justify-center">
        <CardTitle className="mt-5 flex items-center gap-2">
          <Package size={18} />
          Registro de Entrega
        </CardTitle>
        <CardDescription>Adicione as entregas diárias aqui</CardDescription>
        <CardContent className="mt-5 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Botões para selecionar o entregador */}
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">Selecionar Entregador</h4>
                <CourierButtons
                  onSelectCourier={(courierId) =>
                    setSelectedCourier({ id: courierId })
                  }
                />
                {selectedCourier && (
                  <p className="text-sm text-muted-foreground">
                    Entregador selecionado: <b>{selectedCourier.id}</b>
                  </p>
                )}
              </div>

              {/* Campo de seleção de data */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <Popover>
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

              {/* Campo para quantidade de pacotes */}
              <FormField
                control={form.control}
                name="packages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pacotes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Quantidade de pacotes"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo para valor adicional */}
              <FormField
                control={form.control}
                name="additionalFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Adicional</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Valor adicional"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botões de ação */}
              <div className="flex justify-between gap-2">
                <Button variant="outline" asChild>
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
