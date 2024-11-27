"use client";

import { useEffect, useState } from "react";
import CourierList from "./CourierList";
import EditCourier from "./EditCourier";

interface Courier {
  id: string;
  name: string;
  pricePerPackage: number;
}

const GetCourier = () => {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);

  // Buscar todos os entregadores
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const response = await fetch("/api/couriers");
        if (!response.ok) {
          throw new Error("Erro ao buscar entregadores.");
        }
        const data = await response.json();
        setCouriers(data);
      } catch (error) {
        console.error("Erro ao buscar os entregadores:", error);
      }
    };

    fetchCouriers();
  }, []);

  // Salvar entregador
  const handleSave = async () => {
    if (!editingCourier) return;

    try {
      const response = await fetch(`/api/couriers/${editingCourier.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingCourier),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar entregador.");
      }

      const updatedCourier = await response.json();
      setCouriers((prev) =>
        prev.map((courier) =>
          courier.id === updatedCourier.id ? updatedCourier : courier,
        ),
      );
      setEditingCourier(null);
    } catch (error) {
      console.error("Erro ao salvar o entregador:", error);
    }
  };

  return (
    <div className="space-y-6">
      <CourierList
        couriers={couriers}
        onSelect={(id) => console.log(`Selecionado ID: ${id}`)}
        onEdit={(courier) => setEditingCourier(courier)}
      />
      {editingCourier && (
        <EditCourier
          courier={editingCourier}
          onChange={setEditingCourier}
          onSave={handleSave}
          onCancel={() => setEditingCourier(null)}
        />
      )}
    </div>
  );
};

export default GetCourier;
