"use client";

import { Button } from "@/app/_components/ui/button";

interface Courier {
  id: string;
  name: string;
  pricePerPackage: number;
}

interface CourierListProps {
  couriers: Courier[];
  onSelect: (id: string) => void;
  onEdit: (courier: Courier) => void;
}

const CourierList = ({ couriers, onSelect, onEdit }: CourierListProps) => {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Lista de Entregadores</h2>
      <div className="space-y-2">
        {couriers.map((courier) => (
          <div
            key={courier.id}
            className="flex items-center justify-between rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div>
              <p className="font-medium">{courier.name}</p>
              <p className="text-sm text-muted-foreground">
                R$ {courier.pricePerPackage.toFixed(2)} por pacote
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onSelect(courier.id)}>
                Selecionar
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(courier)}
              >
                Editar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourierList;
