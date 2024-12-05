import React, { useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DeliverySummary = ({ deliveries }: { deliveries: any[] }) => {
  // Calculando as análises
  const summary = useMemo(() => {
    return deliveries.reduce(
      (acc, delivery) => ({
        totalDeliveries: acc.totalDeliveries + 1,
        totalPackages: acc.totalPackages + delivery.packages,
        totalValue: acc.totalValue + delivery.totalValue,
        totalAdditional: acc.totalAdditional + (delivery.additionalValue || 0), // Garantindo que o valor adicional seja 0 se não existir
      }),
      {
        totalDeliveries: 0,
        totalPackages: 0,
        totalValue: 0,
        totalAdditional: 0,
      },
    );
  }, [deliveries]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3>Total de Entregas</h3>
        <p>{summary.totalDeliveries}</p>
      </div>
      <div>
        <h3>Total de Pacotes</h3>
        <p>{summary.totalPackages}</p>
      </div>
      <div>
        <h3>Valores Adicionais</h3>
        <p>R$ {summary.totalAdditional.toFixed(2)}</p>
      </div>
      <div>
        <h3>Saldo Total</h3>
        <p>R$ {summary.totalValue.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default DeliverySummary;
