"use client";
import { useEffect, useState } from "react";
import CourierList from "./CourierList";
import EditCourier from "./edit-courier";
import { Courier } from "@prisma/client";

interface GetCourierProps {
  onSelect?: (courier: Courier) => void;
}

const GetCourier = ({ onSelect }: GetCourierProps) => {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);

  // Função para buscar entregadores
  const fetchCouriers = async () => {
    try {
      const response = await fetch("/api/couriers");
      if (!response.ok) throw new Error("Erro ao buscar entregadores.");
      const data = await response.json();
      setCouriers(data);
    } catch (error) {
      console.error("Erro ao buscar os entregadores:", error);
    }
  };

  // Carregar entregadores ao montar
  useEffect(() => {
    fetchCouriers();
  }, []);

  // Salvar entregador (edição)
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

      if (!response.ok) throw new Error("Erro ao salvar entregador.");
      await fetchCouriers();
      setEditingCourier(null);
    } catch (error) {
      console.error("Erro ao salvar o entregador:", error);
    }
  };

  // Excluir entregador
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/couriers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir entregador.");
      await fetchCouriers();
      setEditingCourier(null);
    } catch (error) {
      console.error("Erro ao excluir entregador:", error);
    }
  };

  const handleSelect = (courier: Courier) => {
    onSelect?.(courier);
  };

  return (
    <>
      {/* Lista de Entregadores */}
      <CourierList
        couriers={couriers}
        onSelect={handleSelect}
        onEdit={(courier) => setEditingCourier(courier)}
      />

      {/* Modal de Edição */}
      {editingCourier && (
        <EditCourier
          courier={editingCourier}
          onChange={setEditingCourier}
          onSave={handleSave}
          onCancel={() => setEditingCourier(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default GetCourier;
