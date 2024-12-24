import { useToast } from "@/app/_hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createOrUpdateCourier,
  deleteCourier,
} from "@/app/_actions/_courier-actions/courier";
import AuthGuard from "@/app/_components/AuthGuard";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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

import { Button } from "@/app/_components/ui/button";
import { PlusCircle, TrashIcon, UserRoundPen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import CourierButtons from "@/app/delivery/_components/searchCourier";
import { MoneyInput } from "./money-input";
import { ToastAction } from "@/app/_components/ui/toast";
import Link from "next/link";

interface Courier {
  id: string;
  name: string;
  pricePerPackage: number;
}

const CourierForm = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reloadCouriers, setReloadCouriers] = useState(false);
  const [editingCourierId, setEditingCourierId] = useState<string | null>(null); // Estado para armazenar o ID do entregador em edição

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Um nome é obrigatório",
    }),
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
      const response = await createOrUpdateCourier({
        ...values,
        id: editingCourierId, // Inclui o ID do entregador, se estiver editando
        companyId: session?.user?.id || "", // Passa o ID da empresa
      });

      if (response.success) {
        toast({
          title: "Sucesso",
          description: editingCourierId
            ? "O entregador foi atualizado com sucesso"
            : "O novo entregador foi criado com sucesso",
          duration: 2000,
        });
        setReloadCouriers((prev) => !prev);
        form.reset();
        setEditingCourierId(null); // Limpa o estado de edição após a submissão
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Opss...",
        description: "Ocorreu um erro ao salvar o entregador",
        duration: 2000,
      });
    }
  }

  async function onDelete(courierId: string) {
    try {
      const response = await deleteCourier(courierId);
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "O entregador foi deletado com sucesso",
          duration: 2000,
        });
        setReloadCouriers((prev) => !prev);
        form.reset();
        setEditingCourierId(null); // Limpa o estado de edição após a submissão
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Opss...",
        description: "Ocorreu um erro ao deletar o entregador",
        action: (
          <ToastAction altText="Verificar entregas!">
            <Link href="/summary">Verificar entregas</Link>
          </ToastAction>
        ),
        duration: 3000,
      });
    }
  }

  return (
    <AuthGuard>
      <div className="min-w-screen flex min-h-screen items-center justify-center">
        <Card className="w-[95%] md:w-1/2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PlusCircle size={20} />
              {editingCourierId ? "Editar entregador" : "Criar novo entregador"}
            </CardTitle>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost">
                  <UserRoundPen size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Editar um entregador</DialogTitle>
                <CourierButtons
                  onSelectCourier={(courier: Courier) => {
                    form.setValue("name", courier.name);
                    form.setValue("pricePerPackage", courier.pricePerPackage);
                    setEditingCourierId(courier.id); // Define o ID do entregador em edição
                    setIsOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
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
                    onClick={() => {
                      form.reset();
                      setEditingCourierId(null); // Limpa o estado de edição ao cancelar
                    }}
                  >
                    Cancelar
                  </Button>
                  {editingCourierId && (
                    <Button
                      variant="destructive"
                      type="button" // Evita comportamento de submissão
                      onClick={async () => {
                        await onDelete(editingCourierId!); // Chama a função de exclusão
                        setEditingCourierId(null); // Limpa o estado após exclusão
                      }}
                    >
                      <TrashIcon size={16} />
                    </Button>
                  )}

                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? "Enviando..."
                      : editingCourierId
                        ? "Atualizar"
                        : "Adicionar"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
};

export default CourierForm;
