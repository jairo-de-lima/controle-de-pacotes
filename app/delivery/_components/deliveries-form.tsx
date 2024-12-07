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
import { CalendarIcon, CheckCircle, Package } from "lucide-react";
import { cn } from "@/app/_lib/utils";
import CourierButtons from "./searchCourier";
import { CreateDeliveries } from "../_actions/deliveries-form";
import AuthGuard from "@/app/_components/AuthGuard";
import { MoneyInput } from "@/app/addperson/_components/money-input";
import { useToast } from "@/app/_hooks/use-toast";

const DeliveriesForm = () => {
  const { data: session } = useSession();
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  const formSchema = z.object({
    date: z.date({
      required_error: "Necessário fornecer a data",
    }),
    packages: z
      .number()
      .positive("A quantidade de pacotes deve ser maior que zero"),
    additionalFee: z.number(),
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
      toast({
        title: "Opss...",
        description: "Por favor, selecione um entregador antes de enviar!",
      });
      return;
    }
    const { pricePerPackage } = selectedCourier;
    const totalValue = pricePerPackage * values.packages + values.additionalFee;

    try {
      const response = await CreateDeliveries({
        ...values,
        companyId: session?.user?.id || "",
        courierId: selectedCourier.id,
        totalValue,
      });

      toast({
        title: "Sucesso",
        description: response.message,
        duration: 2000,
      });
      form.reset();
      setSelectedCourier(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Opss",
        description: "Houve algum erro! verifique os dados e tente novamente!",
        variant: "destructive",
        duration: 2000,
      });
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
              <div className="relative flex flex-col justify-center gap-2">
                <CourierButtons
                  onSelectCourier={(courier) => setSelectedCourier(courier)}
                />
                {selectedCourier && (
                  <CheckCircle
                    size={18}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-green-400"
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
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
                        value={field.value === 0 ? "" : field.value}
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            field.onChange("");
                          }
                        }}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10) || 0;
                          field.onChange(value);
                        }}
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
                    <FormLabel>Valor Adicional</FormLabel>
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
