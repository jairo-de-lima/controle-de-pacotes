// "use client";

// import { Button } from "@/app/_components/ui/button";
// import { Input } from "@/app/_components/ui/input";
// import { Label } from "@//app/_components/ui/label";

// interface Courier {
//   id: string;
//   name: string;
//   pricePerPackage: number;
// }

// interface EditCourierProps {
//   courier: Courier;
//   onChange: (courier: Courier) => void;
//   onSave: () => void;
//   onCancel: () => void;
// }

// const EditCourier = ({
//   courier,
//   onChange,
//   onSave,
//   onCancel,
// }: EditCourierProps) => {
//   return (
//     <div className="rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
//       <h2 className="mb-4 text-xl font-bold">Editar Entregador</h2>
//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="name">Nome</Label>
//           <Input
//             id="name"
//             name="name"
//             value={courier.name}
//             onChange={(e) => onChange({ ...courier, name: e.target.value })}
//           />
//         </div>
//         <div>
//           <Label htmlFor="pricePerPackage">Preço por Pacote</Label>
//           <Input
//             id="pricePerPackage"
//             type="number"
//             name="pricePerPackage"
//             value={courier.pricePerPackage}
//             onChange={(e) =>
//               onChange({
//                 ...courier,
//                 pricePerPackage: parseFloat(e.target.value),
//               })
//             }
//           />
//         </div>
//         <div className="flex gap-2">
//           <Button onClick={onSave}>Salvar</Button>
//           <Button variant="outline" onClick={onCancel}>
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditCourier;
