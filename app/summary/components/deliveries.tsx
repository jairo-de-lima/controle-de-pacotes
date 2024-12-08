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

type Delivery = {
  courierId: string;
  id: string;
  date: string;
  packages: number;
  totalValue: number;
  additionalValue: number;
  deliveryPersonId: string;
};

type DeliveryPerson = {
  id: string;
  name: string;
};

export function Delivery() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [deliveryPeople, setDeliveryPeople] = useState<DeliveryPerson[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [fetchedDeliveries, fetchedPeople] = await Promise.all([
        fetch("/api/deliveries").then((res) => res.json()),
        fetch("/api/couriers").then((res) => res.json()),
      ]);

      console.log("Entregas recebidas:", fetchedDeliveries);
      console.log("Entregadores recebidos:", fetchedPeople);

      setDeliveries(fetchedDeliveries);
      setDeliveryPeople(fetchedPeople);
    }

    fetchData();
  }, []);

  const handleCardClick = (personId: string) => {
    setSelectedPerson(personId);
    setIsOpen(true);
  };
  const selectedPersonDeliveries = selectedPerson
    ? deliveries.filter((delivery) => delivery.courierId === selectedPerson)
    : [];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {deliveryPeople.map((person) => {
          const personDeliveries = deliveries.filter(
            (delivery) => delivery.courierId === person.id,
          );
          const totalDeliveries = personDeliveries.length;
          const totalValue = personDeliveries.reduce(
            (sum, delivery) => sum + delivery.totalValue,
            0,
          );

          return (
            <Card
              key={person.id}
              className="cursor-pointer shadow-md hover:shadow-lg"
              onClick={() => handleCardClick(person.id)}
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold">{person.name}</h3>
                <p>Total de entregas: {totalDeliveries}</p>
                <p>Total de ganhos: R${totalValue.toFixed(2)}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="hidden">
            Detalhes
          </Button>
        </DialogTrigger>
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
                  className="rounded-md border p-4 shadow-sm"
                >
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(delivery.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Pacotes entregues:</strong> {delivery.packages}
                  </p>
                  <p>
                    <strong>Valor adicional:</strong> R$
                    {delivery.additionalValue
                      ? delivery.additionalValue.toFixed(2)
                      : "0.00"}
                  </p>
                  <p>
                    <strong>Valor total:</strong> R$
                    {delivery.totalValue.toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p>Não há entregas registradas para este entregador.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
