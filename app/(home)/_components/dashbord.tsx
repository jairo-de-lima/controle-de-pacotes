"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import Loading from "@/app/loading/Loading";

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
    value: number;
  }>;
}
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Card className="flex flex-col items-center justify-center bg-transparent p-2">
        <CardTitle className="text-sm font-extrabold uppercase">
          {payload[0].payload.name}
        </CardTitle>
        <CardContent className="text-sm font-bold">
          Ganhos: R$ {Number(payload[0].value).toFixed(2)}
        </CardContent>
      </Card>
    );
  }
  return null;
};

export default function Dashboard() {
  const [courierStats, setCourierStats] = useState<DeliveryStats>({
    totalPackages: 0,
    totalRoutes: 0,
    courierEarnings: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Calcular ganhos por entregador
        const courierEarnings = couriersData.map((courier: Courier) => {
          // Filtrar entregas deste entregador e somar o valor total
          const courierDeliveries = deliveriesData.filter(
            (d: { courierId: string }) => d.courierId === courier.id,
          );
          const totalValue = courierDeliveries.reduce(
            (sum: number, delivery: { totalValue: number }) =>
              sum + delivery.totalValue,
            0,
          );

          return {
            name: courier.name,
            value: totalValue,
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

  // Cores para o gráfico de pizza
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

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
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
      {/* Cartão de Estatísticas Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral de Entregas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              Total de Pacotes Entregues:
              <span className="ml-2 font-bold">
                {courierStats.totalPackages}
              </span>
            </p>
            <p className="text-sm">
              Total de Rotas Efetuadas:
              <span className="ml-2 font-bold">{courierStats.totalRoutes}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza de Ganhos por Entregador */}
      <Card>
        <CardHeader>
          <CardTitle>Ganhos por Entregador</CardTitle>
        </CardHeader>
        <CardContent>
          {courierStats.courierEarnings.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courierStats.courierEarnings}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  // label={({ name, percent }) =>
                  //   `${name} ${(percent * 100).toFixed(0)}%`
                  // }
                >
                  {courierStats.courierEarnings.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                />

                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">
              Sem dados de ganhos disponíveis
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
