"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useState, useEffect } from "react";

const CourierButtons = ({ onSelectCourier }) => {
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const response = await fetch("/api/couriers"); // Endpoint correto
        const data = await response.json();
        setCouriers(data);
      } catch (error) {
        console.error("Erro ao buscar couriers:", error);
      }
    };

    fetchCouriers();
  }, []);

  return (
    <div className="flex gap-2">
      {/* Gerenciando seleção com onValueChange */}
      <Select
        onValueChange={(selectedCourierId) => {
          const selectedCourier = couriers.find(
            (courier) => courier.id === selectedCourierId,
          );
          if (selectedCourier) {
            onSelectCourier(selectedCourier.id); // Chama o callback passando o ID do entregador
          }
        }}
      >
        <SelectTrigger className="w-[180px]">
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
    </div>
  );
};

export default CourierButtons;