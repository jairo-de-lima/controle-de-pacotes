"use client";

import React, { useState, useEffect } from "react";
import Loading from "@/app/loading/Loading";
import OverviewCard from "./overview-card";
import EarningsPieChart from "./earnings-pie-chart";
import TopCouriers from "./top-couriers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

interface Courier {
  id: string;
  name: string;
  pricePerPackage: number;
}

interface Delivery {
  id: string;
  courierId: string;
  date: string;
  packages: number;
  totalValue: number;
}

interface DeliveryStats {
  totalPackages: number;
  totalRoutes: number;
  courierEarnings: Array<{
    name: string;
    value: number;
    totalRoutes: number;
    totalPackages: number;
  }>;
}

export default function Dashboard() {
  const [courierStats, setCourierStats] = useState<DeliveryStats>({
    totalPackages: 0,
    totalRoutes: 0,
    courierEarnings: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtro de mês/ano
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0 = Jan
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const { data: session } = useSession();

  useEffect(() => {
    const fetchCourierStats = async () => {
      try {
        setIsLoading(true);

        // Buscar dados
        const deliveriesResponse = await fetch("/api/deliveries");
        const deliveriesData: Delivery[] = await deliveriesResponse.json();

        const couriersResponse = await fetch("/api/couriers");
        const couriersData: Courier[] = await couriersResponse.json();

        // 🔑 Filtrar entregas pelo mês/ano selecionados
        const filteredDeliveries = deliveriesData.filter((delivery) => {
          const deliveryDate = new Date(delivery.date.replace(" ", "T"));
          return (
            deliveryDate.getMonth() === selectedMonth &&
            deliveryDate.getFullYear() === selectedYear
          );
        });

        // Calcular estatísticas
        const totalPackages = filteredDeliveries.reduce(
          (sum, delivery) => sum + delivery.packages,
          0,
        );
        const totalRoutes = filteredDeliveries.length;

        const courierEarnings = couriersData.map((courier) => {
          const courierDeliveries = filteredDeliveries.filter(
            (d) => d.courierId === courier.id,
          );

          const totalValue = courierDeliveries.reduce(
            (sum, delivery) => sum + delivery.totalValue,
            0,
          );

          const totalRoutes = courierDeliveries.length;
          const totalPackages = courierDeliveries.reduce(
            (sum, delivery) => sum + delivery.packages,
            0,
          );

          return {
            name: courier.name,
            value: totalValue,
            totalRoutes,
            totalPackages,
          };
        });

        setCourierStats({
          totalPackages,
          totalRoutes,
          courierEarnings,
        });

        setIsLoading(false);
      } catch (err) {
        setError("Erro ao carregar estatísticas");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchCourierStats();
  }, [selectedMonth, selectedYear]); // 👈 Recalcular quando trocar mês/ano

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  // Lista de meses
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return (
    <div className="mt-16 flex w-full flex-col items-center justify-center">
      <Card className="flex w-[95%] max-w-3xl flex-col items-center">
        <CardHeader className="w-full">
          <CardTitle className="flex items-center justify-center text-base">
            Bem-vindo ao Dashboard,{" "}
            <span className="uppercase">{session?.user?.name}</span>!
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 🔽 Seletor de mês/ano */}
          <div className="flex gap-2">
            <Select
              value={String(selectedMonth)}
              onValueChange={(value) => setSelectedMonth(Number(value))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(selectedYear)}
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }).map((_, i) => {
                  const year = now.getFullYear() - i;
                  return (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <CardDescription className="flex items-center justify-center text-sm font-bold">
            Estatísticas de {months[selectedMonth]} / {selectedYear}
          </CardDescription>
        </CardContent>
      </Card>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 p-4 md:grid-cols-3">
        <OverviewCard
          totalPackages={courierStats.totalPackages}
          totalRoutes={courierStats.totalRoutes}
        />
        <EarningsPieChart courierEarnings={courierStats.courierEarnings} />
        <TopCouriers courierEarnings={courierStats.courierEarnings} />
      </div>
    </div>
  );
}
