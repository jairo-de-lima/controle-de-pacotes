"use client";

import { useEffect, useState } from "react";

interface Courier {
  id: string;
  name: string;
  pricePerPackage: number;
  companyId: string;
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

  // Salvar ou atualizar entregador
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
      setCouriers((prevCouriers) =>
        prevCouriers.map((courier) =>
          courier.id === updatedCourier.id ? updatedCourier : courier,
        ),
      );
      setEditingCourier(null); // Finalizar edição
    } catch (error) {
      console.error("Erro ao salvar o entregador:", error);
    }
  };

  // Atualizar campo ao editar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCourier) return;
    const { name, value } = e.target;
    setEditingCourier({ ...editingCourier, [name]: value });
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Lista de Entregadores</h1>
      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-background">
            <th className="border border-gray-200 px-4 py-2">Nome</th>
            <th className="border border-gray-200 px-4 py-2">
              Preço por Pacote
            </th>
            <th className="border border-gray-200 px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {couriers.map((courier) => (
            <tr key={courier.id}>
              <td className="border border-gray-200 px-4 py-2">
                {courier.name}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                R$ {courier.pricePerPackage.toFixed(2)}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                <button
                  className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                  onClick={() => setEditingCourier(courier)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingCourier && (
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">Editar Entregador</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nome</label>
              <input
                type="text"
                name="name"
                value={editingCourier.name}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Preço por Pacote
              </label>
              <input
                type="number"
                name="pricePerPackage"
                value={editingCourier.pricePerPackage}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-2 py-1"
              />
            </div>
            <button
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              onClick={handleSave}
            >
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetCourier;
