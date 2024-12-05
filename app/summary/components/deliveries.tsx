// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/app/_components/ui/dialog";
// import { Button } from "@/app/_components/ui/button";

// import { Card } from "@/app/_components/ui/card";
// import { ExportPDFButton } from "./_actions/export-pdf-button";

// type Delivery = {
//   id: string;
//   date: string;
//   packages: number;
//   totalValue: number;
//   additionalValue: number;
//   deliveryPersonId: string;
// };

// type DeliveryPerson = {
//   id: string;
//   name: string;
// };

// type DateRange = {
//   from: Date;
//   to: Date;
// };

// export function Delivery() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
//   const [dateRange, setDateRange] = useState<DateRange>({
//     from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
//     to: new Date(),
//   });
//   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
//   const [deliveryPeople, setDeliveryPeople] = useState<DeliveryPerson[]>([]);

//   useEffect(() => {
//     async function fetchDeliveries() {
//       const fetchedDeliveries: Delivery[] = await fetch("/api/deliveries")
//         .then((res) => res.json())
//         .catch((error) => console.error("Erro ao buscar entregas:", error));
//       setDeliveries(fetchedDeliveries);
//     }

//     fetchDeliveries();
//   }, []);

//   useEffect(() => {
//     async function fetchDeliveryPeople() {
//       const fetchedPeople: DeliveryPerson[] = await fetch("/api/couriers")
//         .then((res) => res.json())
//         .catch((error) => console.error("Erro ao buscar entregadores:", error));
//       setDeliveryPeople(fetchedPeople);
//     }

//     fetchDeliveryPeople();
//   }, []);

//   const handleCardClick = (personId: string) => {
//     setSelectedPerson(personId);
//     setIsOpen(true);
//   };

//   return (
//     <div>
//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//         {deliveryPeople.map((person) => {
//           const personDeliveries = deliveries.filter(
//             (delivery) => delivery.deliveryPersonId === person.id,
//           );
//           const totalDeliveries = personDeliveries.length;
//           const totalValue = personDeliveries.reduce(
//             (sum, delivery) => sum + delivery.totalValue,
//             0,
//           );

//           return (
//             <Card
//               key={person.id}
//               className="cursor-pointer shadow-md hover:shadow-lg"
//               onClick={() => handleCardClick(person.id)}
//             >
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold">{person.name}</h3>
//                 <p>Total de entregas: {totalDeliveries}</p>
//                 <p>Total de ganhos: R${totalValue.toFixed(2)}</p>
//               </div>
//             </Card>
//           );
//         })}
//       </div>

//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogTrigger asChild>
//           <Button variant="outline" className="hidden">
//             Detalhes
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle>Detalhes das Entregas</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             {selectedPerson &&
//               deliveries
//                 .filter(
//                   (delivery) => delivery.deliveryPersonId === selectedPerson,
//                 )
//                 .filter(
//                   (delivery) =>
//                     new Date(delivery.date) >= dateRange.from &&
//                     new Date(delivery.date) <= dateRange.to,
//                 )
//                 .map((delivery) => (
//                   <div
//                     key={delivery.id}
//                     className="rounded-md border p-4 shadow-sm"
//                   >
//                     <p>Data: {new Date(delivery.date).toLocaleDateString()}</p>
//                     <p>Pacotes entregues: {delivery.packages}</p>
//                     <p>
//                       Valor adicional: R${delivery.additionalValue.toFixed(2)}
//                     </p>
//                     <p>Valor total: R${delivery.totalValue.toFixed(2)}</p>
//                   </div>
//                 ))}
//           </div>
//           <ExportPDFButton
//             dateRange={dateRange}
//             selectedPerson={selectedPerson}
//             deliveries={deliveries}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
