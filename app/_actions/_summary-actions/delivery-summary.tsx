import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import React, { useMemo } from "react";
import { format } from "date-fns/format";

type DateRange = {
  from?: Date;
  to?: Date;
};

type DeliverySummaryProps = {
  deliveries: Delivery[];
  selectedPerson: Courier | null;
  dateRange: DateRange;
};
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

const DeliverySummary: React.FC<DeliverySummaryProps> = ({
  deliveries,
  selectedPerson,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dateRange,
}) => {
  const summary = useMemo(() => {
    return deliveries.reduce(
      (acc, delivery) => ({
        totalDeliveries: acc.totalDeliveries + 1,
        totalPackages: acc.totalPackages + delivery.packages,
        totalValue: acc.totalValue + delivery.totalValue,
        totalAdditional: acc.totalAdditional + (delivery.additionalFee || 0),
        dateRange: {
          from: delivery.date,
          to: delivery.date,
        },
      }),
      {
        totalDeliveries: 0,
        totalPackages: 0,
        totalValue: 0,
        totalAdditional: 0,
        dateRange: {
          from: deliveries.length ? deliveries[0].date : new Date(),
          to: deliveries.length ? deliveries[0].date : new Date(),
        },
      },
    );
  }, [deliveries]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-3">
        <Card className="h-24">
          <CardHeader className="-mt-3">
            <CardTitle className="text-base">total de entregas</CardTitle>
          </CardHeader>
          <CardContent>{summary.totalDeliveries}</CardContent>
        </Card>
        <Card className="h-24">
          <CardHeader className="-mt-3">
            <CardTitle className="text-base">Valores adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.totalAdditional.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </CardContent>
        </Card>
        <Card className="h-24">
          <CardHeader className="-mt-3">
            <CardTitle className="text-base">Valores totais</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.totalValue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </CardContent>
        </Card>
      </div>
      {/* Detalhamento por Data */}
      <Card className="mt-3">
        <CardHeader>
          <CardTitle className="text-base">Detalhamento por Data</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:rounded-md [&::-webkit-scrollbar]:bg-primary">
          <ScrollArea>
            {selectedPerson &&
              deliveries.map((delivery) => (
                <div key={delivery.id} className="flex flex-col gap-2 border-b">
                  <div className="mt-2 flex w-full justify-center">
                    <h2 className="text-lg font-bold">
                      Data: {""}
                      {format(delivery.date, "dd/MM/yyyy")}
                    </h2>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 md:flex-row md:justify-between">
                    <p>Total de Pacotes: {delivery.packages} </p>
                    <p>
                      Valor Adicional: R$ {delivery.additionalFee.toFixed(2)}
                    </p>
                    <p>
                      Valor Total: R$
                      {(delivery.totalValue + delivery.additionalFee).toFixed(
                        2,
                      )}{" "}
                    </p>
                  </div>
                </div>
              ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
    // <div>
    //   <div className="mb-4">
    //     <h2>Resumo de Entregas</h2>
    //     <p>
    //       <strong>Entregador:</strong>{" "}
    //       {selectedPerson ? selectedPerson?.name : "Todos"}
    //     </p>
    //     <p>
    //       <strong>Período:</strong>{" "}
    //       {dateRange.from && dateRange.to
    //         ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
    //         : "Nenhum período selecionado"}
    //     </p>
    //   </div>
    //   <div className="grid grid-cols-2 gap-4">
    //     <div>
    //       <h3>Total de Entregas</h3>
    //       <p>{summary.totalDeliveries}</p>
    //     </div>
    //     <div>
    //       <h3>Total de Pacotes</h3>
    //       <p>{summary.totalPackages}</p>
    //     </div>
    //     <div>
    //       <h3>Valores Adicionais</h3>
    //       <p>R$ {summary.totalAdditional.toFixed(2)}</p>
    //     </div>
    //     <div>
    //       <h3>Saldo Total</h3>
    //       <p>R$ {(summary.totalValue + summary.totalAdditional).toFixed(2)}</p>
    //     </div>
    //   </div>
    // </div>
  );
};

export default DeliverySummary;
