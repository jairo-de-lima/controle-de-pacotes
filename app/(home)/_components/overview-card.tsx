"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";

interface OverviewCardProps {
  totalPackages: number;
  totalRoutes: number;
}

const OverviewCard = ({ totalPackages, totalRoutes }: OverviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral de Entregas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            Total de Pacotes Entregues:
            <span className="ml-2 font-bold">{totalPackages}</span>
          </p>
          <p className="text-sm">
            Total de Rotas Efetuadas:
            <span className="ml-2 font-bold">{totalRoutes}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
