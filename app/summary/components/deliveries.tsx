"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { PencilIcon, TrashIcon, User } from "lucide-react";
import { useToast } from "@/app/_hooks/use-toast";
import { EditDelivery } from "./edit-deliveries";

type Delivery = {
  courierId: string;
  id: string;
  date: string;
  packages: number;
  totalValue: number;
  additionalFee: number;
  deliveryPersonId: string;
};

type DeliveryPerson = {
  id: string;
  name: string;
  pricePerPackage: number;
};

export function Delivery() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [deliveryPeople, setDeliveryPeople] = useState<DeliveryPerson[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [deliveryToEdit, setDeliveryToEdit] = useState<Delivery | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [fetchedDeliveries, fetchedPeople] = await Promise.all([
        fetch("/api/deliveries").then((res) => res.json()),
        fetch("/api/couriers").then((res) => res.json()),
      ]);
      console.log(fetchedDeliveries);
      console.log(fetchedPeople);
      setDeliveries(fetchedDeliveries);
      setDeliveryPeople(fetchedPeople);
    }

    fetchData();
  }, []);

  const handleDeliveryUpdated = async () => {
    setIsEditing(false);
    setDeliveryToEdit(null);
    const updatedDeliveries = fetch("/api/deliveries").then((res) =>
      res.json(),
    );
    setDeliveries(await updatedDeliveries);
  };

  const handleCardClick = (personId: string) => {
    setSelectedPerson(personId);
    setIsOpen(true);
  };

  const selectedPersonDeliveries = selectedPerson
    ? deliveries.filter((delivery) => delivery.courierId === selectedPerson)
    : [];

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/deliveries/${id}`, {
        method: "DELETE",
      });
      toast({
        title: "Entrega deletada com sucesso!",
        description: "A entrega foi deletada com sucesso.",
        duration: 2000,
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao deletar entrega:", error);
      toast({
        title: "Erro ao deletar entrega.",
        description: "Ocorreu um erro ao deletar a entrega.",
        duration: 2000,
      });
    }
    const updatedDeliveries = await fetch("/api/deliveries").then((res) =>
      res.json(),
    );
    setDeliveries(updatedDeliveries);
  };

  const handleEdit = (id: string) => {
    const delivery = deliveries.find((d) => d.id === id);
    if (delivery) {
      setDeliveryToEdit({
        ...delivery,
        date: delivery.date,
      });
      setIsEditing(true);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {deliveryPeople.map((person) => {
          const personDeliveries = deliveries.filter(
            (delivery) => delivery.courierId === person.id,
          );
          const totalDeliveries = personDeliveries.length;
          const pricePerPackage = person.pricePerPackage;
          const totalValue =
            pricePerPackage *
              personDeliveries.reduce(
                (acc, delivery) => acc + delivery.packages,
                0,
              ) +
            personDeliveries.reduce(
              (acc, delivery) => acc + delivery.additionalFee,
              0,
            );

          return (
            <Card
              key={person.id}
              className="cursor-pointer shadow-md hover:shadow-lg"
              onClick={() => handleCardClick(person.id)}
            >
              <div className="p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <User size={20} />
                  {person.name}
                </h3>
                <p>Total de entregas: {totalDeliveries}</p>
                <p>Total de ganhos: R${totalValue.toFixed(2)}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[90%] rounded-md">
          <DialogHeader>
            <DialogTitle className="flex w-full justify-center gap-2">
              Detalhes das Entregas
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPersonDeliveries.length > 0 ? (
              selectedPersonDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex w-full items-center justify-between gap-2 rounded-md border p-4 shadow-sm"
                >
                  <div>
                    <p>
                      <strong>Data:</strong>{" "}
                      {new Date(delivery.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Pacotes entregues:</strong> {delivery.packages}
                    </p>
                    <p>
                      <strong>Valor adicional:</strong> R$
                      {delivery.additionalFee
                        ? delivery.additionalFee.toFixed(2)
                        : "0.00"}
                    </p>
                    <p>
                      <strong>Valor total:</strong> R$
                      {delivery.totalValue.toFixed(2)}
                    </p>
                  </div>
                  <div className="mr-0 flex">
                    <Button
                      variant="destructive"
                      className="mr-2"
                      onClick={() => handleDelete(delivery.id)}
                    >
                      <TrashIcon size={18} />
                    </Button>
                    <Dialog open={isEditing} onOpenChange={setIsEditing}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="mr-2"
                          onClick={() => handleEdit(delivery.id)}
                        >
                          <PencilIcon size={18} />
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </div>
              ))
            ) : (
              <p>Não há entregas registradas para este entregador.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {deliveryToEdit && isEditing && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogTitle>Editar Entrega</DialogTitle>
            <EditDelivery
              delivery={{
                ...deliveryToEdit,
                date: new Date(deliveryToEdit.date),
              }}
              onDeliveryUpdated={handleDeliveryUpdated}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
