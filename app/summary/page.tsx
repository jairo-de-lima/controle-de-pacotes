"use client";

import React, { useState, useEffect, useCallback } from "react";

import DeliveryFilter from "./components/_actions/delivery-filter";
import DeliverySummary from "./components/_actions/delivery-summary";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../_components/ui/dialog"; // Certifique-se de ter os componentes de dialog
import { CalendarClock } from "lucide-react";
import { DeliveryAnalytics } from "./components/_actions/dellivery-analytics";

type Courier = {
  id: string;
  name: string;
};

type Delivery = {
  id: string;
  courierId: string;
  date: string;
  // Outros campos relevantes da entrega
};

const SummaryPage: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controle do estado do dialog

  const fetchCouriers = useCallback(async () => {
    try {
      const response = await fetch("/api/couriers");
      if (!response.ok) throw new Error("Erro ao buscar entregadores");

      const data: Courier[] = await response.json();
      setCouriers(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchDeliveries = useCallback(async () => {
    try {
      let url = "/api/deliveries";
      const queryParams: string[] = [];

      if (selectedPerson !== "all") {
        queryParams.push(`courierId=${selectedPerson}`);
      }

      if (dateRange.from && dateRange.to) {
        queryParams.push(
          `start=${dateRange.from.toISOString()}&end=${dateRange.to.toISOString()}`,
        );
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      console.log("Fetching deliveries with URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Deliveries fetched:", data);

      setDeliveries(data);
    } catch (error) {
      console.error("Erro ao carregar entregas:", error);
    }
  }, [selectedPerson, dateRange]);

  useEffect(() => {
    fetchCouriers();
  }, [fetchCouriers]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return (
    <div className="min-w-screen flex min-h-screen flex-col items-center justify-center p-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="mb-4 text-xl font-bold">
            Resumo de Entregas
          </CardTitle>
          {/* Ícone de calendário como botão */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <CalendarClock size={24} />
              </button>
            </DialogTrigger>{" "}
          </Dialog>
        </CardHeader>
        <CardContent>
          <DeliveryFilter
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
            dateRange={dateRange}
            setDateRange={setDateRange}
            couriers={couriers}
          />
          <DeliverySummary deliveries={deliveries} />
        </CardContent>
      </Card>

      {/* Dialog do DeliveryAnalytics */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Análise de Entregas</DialogTitle>
          </DialogHeader>
          <DeliveryAnalytics />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SummaryPage;
