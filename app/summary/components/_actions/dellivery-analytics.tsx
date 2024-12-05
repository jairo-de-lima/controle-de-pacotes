import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { ExportPDFButton } from "./export-pdf-button";
import DeliveryFilter from "./delivery-filter";
import DeliverySummary from "./delivery-summary";

type Delivery = {
  id: string;
  date: string;
  packages: number;
  totalValue: number;
  additionalValue: number;
  deliveryPersonId: string;
};

type DeliveryPerson = {
  id: string;
  name: string;
};

type DateRange = {
  from: Date;
  to: Date;
};

export function DeliveryAnalytics() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [deliveries, setDeliveries] = useState<Delivery[]>([]); // Estado para armazenar entregas
  const [deliveryPeople, setDeliveryPeople] = useState<DeliveryPerson[]>([]); // Estado para armazenar entregadores

  // Fetch de entregas (simulação)
  useEffect(() => {
    async function fetchDeliveries() {
      const fetchedDeliveries: Delivery[] = await fetch("/api/deliveries")
        .then((res) => res.json())
        .catch((error) => console.error("Erro ao buscar entregas:", error));
      setDeliveries(fetchedDeliveries);
    }

    fetchDeliveries();
  }, []);

  // Fetch de entregadores (simulação)
  useEffect(() => {
    async function fetchDeliveryPeople() {
      const fetchedPeople: DeliveryPerson[] = await fetch("/api/couriers")
        .then((res) => res.json())
        .catch((error) => console.error("Erro ao buscar entregadores:", error));
      setDeliveryPeople(fetchedPeople);
    }

    fetchDeliveryPeople();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Analisar Entregas</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="mb-4 text-center text-xl font-bold">
            Análise de Entregas
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DeliveryFilter
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
            dateRange={dateRange}
            setDateRange={setDateRange}
            couriers={deliveryPeople} // Passando entregadores para o DeliveryFilter
            deliveries={deliveries} // Passando entregas para o DeliveryFilter
          />
          <DeliverySummary deliveries={deliveries} />
        </div>
        <div className="mt-6 text-center">
          <ExportPDFButton
            dateRange={dateRange}
            selectedPerson={selectedPerson}
            deliveryPeople={deliveryPeople}
            deliveries={deliveries}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
