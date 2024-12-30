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

// Tipos para tipar os dados
interface Courier {
  id: string;
  name: string;
  pricePerPackage: number;
}

interface DeliveryStats {
  totalPackages: number;
  totalRoutes: number;
  courierEarnings: Array<{
    name: string;
    value: number; // Ganhos totais
    totalRoutes: number; // Total de rotas
    totalPackages: number; // Total de pacotes entregues
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
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCourierStats = async () => {
      try {
        setIsLoading(true);

        // Buscar dados de entregas
        const deliveriesResponse = await fetch("/api/deliveries");
        const deliveriesData = await deliveriesResponse.json();

        // Buscar entregadores
        const couriersResponse = await fetch("/api/couriers");
        const couriersData = await couriersResponse.json();

        // Calcular estatísticas
        const totalPackages = deliveriesData.reduce(
          (sum: number, delivery: { packages: number }) =>
            sum + delivery.packages,
          0,
        );
        const totalRoutes = deliveriesData.length;

        // Calcular ganhos, total de rotas e total de pacotes por entregador
        const courierEarnings = couriersData.map((courier: Courier) => {
          const courierDeliveries = deliveriesData.filter(
            (d: { courierId: string }) => d.courierId === courier.id,
          );

          const totalValue = courierDeliveries.reduce(
            (sum: number, delivery: { totalValue: number }) =>
              sum + delivery.totalValue,
            0,
          );

          const totalRoutes = courierDeliveries.length;
          const totalPackages = courierDeliveries.reduce(
            (sum: number, delivery: { packages: number }) =>
              sum + delivery.packages,
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
  }, []);

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

  return (
    <div className="mt-16 flex w-full flex-col items-center justify-center">
      <Card className="flex flex-col items-center">
        <CardHeader>
          <CardTitle className="text-base">
            Bem-vindo ao Dashboard,{" "}
            <span className="uppercase">{session?.user?.name} </span>!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm font-bold">
            Bem-vindo ao sistema de gerenciamento de estoque.
          </CardDescription>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
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
