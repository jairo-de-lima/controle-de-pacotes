"use client";

import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

interface Courier {
  id: string;
  name: string;
  pricePerPackage: number;
}

interface CourierListProps {
  couriers: Courier[];
  onSelect: (id: string) => void; // Função para deletar entregador
  onEdit: (courier: Courier) => void; // Função para editar entregador
}

const CourierList = ({ couriers, onSelect, onEdit }: CourierListProps) => {
  return (
    <DialogContent>
      <DialogTitle>Lista de Entregadores</DialogTitle>
      <DialogDescription>
        {/* Dropdown de seleção */}
        {couriers.length >= 10 ? (
          <Select
            onValueChange={(value) => {
              const selectedCourier = couriers.find(
                (courier) => courier.id === value,
              );
              if (selectedCourier) {
                onEdit(selectedCourier); // Passa o entregador selecionado para edição
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar entregador" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Entregadores</SelectLabel>
                {couriers.map((courier) => (
                  <SelectItem key={courier.id} value={courier.id}>
                    {courier.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <div>
            <div className="mt-4 space-y-2">
              {couriers.map((courier) => (
                <div
                  key={courier.id}
                  className="flex items-center justify-between"
                >
                  <Card className="w-full">
                    <CardContent className="flex items-center justify-between">
                      <div>
                        <h1 className="font-medium">{courier.name}</h1>

                        <p className="text-sm text-muted-foreground">
                          R$ {courier.pricePerPackage.toFixed(2)} por pacote
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onEdit(courier)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onSelect(courier.id)}
                        >
                          Deletar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogDescription>
    </DialogContent>
  );
};

export default CourierList;
