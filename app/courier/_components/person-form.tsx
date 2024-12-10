// "use client";

// import { PlusCircle, UserRoundPen } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useSession } from "next-auth/react";
// import { useToast } from "@/app/_hooks/use-toast";
// import { createCourier } from "@/app/_actions/_courier-actions/courier";
// import AuthGuard from "@/app/_components/AuthGuard";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/app/_components/ui/form";
// import { Input } from "@/app/_components/ui/input";
// import { MoneyInput } from "./money-input";
// import { Button } from "@/app/_components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardTitle,
// } from "@/app/_components/ui/card";
// import GetCourier from "./GetPerson";
// import { Dialog, DialogTrigger } from "@/app/_components/ui/dialog";
// import { useState } from "react";

// const PersonForm = () => {
//   const { data: session } = useSession();
//   const { toast } = useToast();
//   const [isOpen, setIsOpen] = useState(false);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [reloadCouriers, setReloadCouriers] = useState(false);

//   const formSchema = z.object({
//     name: z.string().min(2, {
//       message: "Um nome e obrigatório",
//     }),
//     pricePerPackage: z.number().positive({
//       message: "O valor é obrigatório",
//     }),
//   });

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       pricePerPackage: 0,
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       const response = await createCourier({
//         ...values,
//         companyId: session?.user?.id || "", // Passa o ID da empresa
//       });
//       if (response.success) {
//         toast({
//           title: "Sucesso",
//           description: "O novo entregador foi criado com sucesso",
//           duration: 2000,
//         });
//         setReloadCouriers((prev) => !prev);
//       }
//       form.reset();
//     } catch (error) {
//       console.error(error);
//       toast({
//         title: "Opss...",
//         description: "Ocorreu um erro ao criar o novo entregador",
//         duration: 2000,
//       });
//     }
//   }

//   return (
//     <AuthGuard>
//       <Card className="flex min-h-screen items-center justify-center">
//         <CardContent className="m-2 flex w-full max-w-md flex-col rounded-lg border bg-background p-4 shadow-md">
//           <CardTitle className="flex items-center justify-between">
//             <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
//               <PlusCircle className="h-6 w-6" />
//               Cadastro de Entregadores
//             </h2>
//             <Dialog open={isOpen} onOpenChange={setIsOpen}>
//               <DialogTrigger asChild>
//                 <Button variant="ghost">
//                   {""}
//                   <UserRoundPen size={18} />
//                   <GetCourier />
//                 </Button>
//               </DialogTrigger>
//             </Dialog>
//           </CardTitle>
//           <CardDescription>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-8"
//               >
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Nome</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Digite o nome" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="pricePerPackage"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Valor por pacote</FormLabel>
//                       <FormControl>
//                         <MoneyInput
//                           placeholder="Digite o valor"
//                           value={field.value}
//                           onValueChange={({ floatValue }) =>
//                             field.onChange(floatValue)
//                           }
//                           onBlur={field.onBlur}
//                           disabled={field.disabled}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <CardFooter className="flex justify-between gap-1">
//                   <Button onClick={() => form.reset()}>Cancelar</Button>
//                   <Button type="submit">Adicionar</Button>
//                 </CardFooter>
//               </form>
//             </Form>
//           </CardDescription>
//         </CardContent>
//       </Card>
//     </AuthGuard>
//   );
// };

// export default PersonForm;
