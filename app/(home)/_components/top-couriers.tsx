import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { useState } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/app/_components/ui/select";

interface TopCouriersProps {
  courierEarnings: Array<{
    name: string;
    value: number; // Ganhos
    totalRoutes: number; // Total de rotas
    totalPackages: number; // Total de pacotes
  }>;
}

export default function TopCouriers({ courierEarnings }: TopCouriersProps) {
  const [filter, setFilter] = useState<
    "value" | "totalRoutes" | "totalPackages"
  >("value");

  // Função para ordenar os entregadores com base no filtro selecionado
  const sortedCouriers = [...courierEarnings].sort(
    (a, b) => b[filter] - a[filter],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Entregadores</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtro de classificação */}
        <div className="mb-4">
          <Select
            value={filter}
            onValueChange={(value) =>
              setFilter(value as "value" | "totalRoutes" | "totalPackages")
            }
          >
            <SelectTrigger className="w-full">
              <span className="text-sm font-medium">Filtrar por:</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value">Ganhos (R$)</SelectItem>
              <SelectItem value="totalRoutes">Total de Rotas</SelectItem>
              <SelectItem value="totalPackages">Total de Pacotes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de entregadores */}
        {sortedCouriers.length > 0 ? (
          <ul className="space-y-2">
            {sortedCouriers.slice(0, 5).map((courier, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-semibold">
                  {index + 1}. {courier.name}
                </span>
                <span className="text-gray-500">
                  {filter === "value" && `R$ ${courier.value.toFixed(2)}`}
                  {filter === "totalRoutes" && `${courier.totalRoutes} rotas`}
                  {filter === "totalPackages" &&
                    `${courier.totalPackages} pacotes`}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            Nenhum dado disponível para exibir.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
