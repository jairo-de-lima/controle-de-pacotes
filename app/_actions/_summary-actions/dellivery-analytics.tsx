import React, { useState, useEffect } from "react";
import { ExportPDFButton } from "./export-pdf-button";
import DeliveryFilter from "./delivery-filter";
import DeliverySummary from "./delivery-summary";
import { ScrollArea } from "@/app/_components/ui/scroll-area";

type Delivery = {
  id: string;
  courierId: string;
  date: Date;
  packages: number;
  additionalFee: number;
  totalValue: number;
};

type Courier = {
  id: string;
  name: string;
};

type DateRange = {
  from?: Date;
  to?: Date;
};

export function DeliveryAnalytics() {
  const [selectedPerson, setSelectedPerson] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [deliveries, setDeliveries] = useState<Delivery[]>([]); // Estado para armazenar entregas
  const [deliveryPeople, setDeliveryPeople] = useState<Courier[]>([]); // Estado para armazenar entregadores

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
      const fetchedPeople: Courier[] = await fetch("/api/couriers")
        .then((res) => res.json())
        .catch((error) => console.error("Erro ao buscar entregadores:", error));
      setDeliveryPeople(fetchedPeople);
    }

    fetchDeliveryPeople();
  }, []);

  const filteredDeliveries = deliveries.filter((delivery) => {
    if (!dateRange) return true; // Caso `dateRange` seja nulo ou indefinido

    const deliveryDate = new Date(delivery.date.replace(" ", "T"));

    const isWithinDateRange =
      (!dateRange.from || deliveryDate >= dateRange.from) &&
      (!dateRange.to || deliveryDate <= dateRange.to);

    const isSelectedPerson =
      selectedPerson?.id === "all" || !selectedPerson
        ? true
        : delivery.courierId === selectedPerson.id;

    return isWithinDateRange && isSelectedPerson;
  });

  console.log("Props enviadas para DeliverySummary:", {
    deliveries: filteredDeliveries,
    selectedPerson,
    dateRange,
  });

  return (
    <div className="max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
      <ScrollArea className="scroll-area-custom">
        <div className="space-y-4">
          <DeliveryFilter
            selectedPerson={selectedPerson}
            setSelectedPerson={(courier) => setSelectedPerson(courier)}
            dateRange={dateRange}
            setDateRange={setDateRange}
            couriers={deliveryPeople}
            deliveries={deliveries}
          />
          <DeliverySummary
            deliveries={filteredDeliveries}
            selectedPerson={selectedPerson}
            dateRange={dateRange}
          />
        </div>
        <div className="mt-6 text-center">
          <ExportPDFButton
            deliveries={filteredDeliveries}
            selectedPerson={selectedPerson}
            dateRange={dateRange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
