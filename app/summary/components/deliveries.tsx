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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Package, PencilIcon, SearchIcon, TrashIcon, User } from "lucide-react";
import { useToast } from "@/app/_hooks/use-toast";
import { EditDelivery } from "./edit-deliveries";
import { DeliveryAnalytics } from "@/app/_actions/_summary-actions/dellivery-analytics";
import { ScrollArea } from "@/app/_components/ui/scroll-area";

type Delivery = {
  courierId: string;
  id: string;
  date: string;
  packages: number;
  totalValue: number;
  additionalFee: number;
  deliveryPersonId: string;
  paid: boolean;
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
  const [searchDeliveries, setSearchDeliveries] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [fetchedDeliveries, fetchedPeople] = await Promise.all([
        fetch("/api/deliveries").then((res) => res.json()),
        fetch("/api/couriers").then((res) => res.json()),
      ]);

      setDeliveries(fetchedDeliveries);
      setDeliveryPeople(fetchedPeople);
      console.log(fetchedDeliveries);
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

  const openSearchDeliveries = () => {
    setSearchDeliveries(true);
  };

  return (
    <div className="bg-muted-foreground-foreground mb-4 mt-20 flex w-[80%] flex-col items-center justify-center">
      <div className="mb-4 flex w-full items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Package size={20} />
          Resumo de entregas
        </h1>
        <div>
          <Button
            variant="link"
            onClick={() => {
              openSearchDeliveries();
            }}
          >
            <SearchIcon size={20} />
          </Button>
        </div>
      </div>

      {searchDeliveries && (
        <Dialog open={searchDeliveries} onOpenChange={setSearchDeliveries}>
          <DialogContent className="rounded-md md:max-w-[80%]">
            <DialogTitle>Analise de Entregas por periodo</DialogTitle>
            <DeliveryAnalytics />
          </DialogContent>
        </Dialog>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {deliveryPeople
          .filter((person) => {
            // Filtra para incluir somente entregadores com entregas realizadas
            const personDeliveries = deliveries.filter(
              (delivery) => delivery.courierId === person.id,
            );
            return personDeliveries.length > 0; // Verifica se tem entregas
          })
          .map((person) => {
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
                <CardHeader className="border-b p-1">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold uppercase">
                    <User size={20} />
                    {person.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p>Entregas: {totalDeliveries}</p>
                  <p>Total de ganhos: R${totalValue.toFixed(2)}</p>
                </CardContent>
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
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {selectedPersonDeliveries.length > 0 ? (
                selectedPersonDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className={`flex w-full items-center justify-between gap-2 rounded-md border p-4 shadow-sm ${delivery.paid === true ? "bg-muted-foreground" : ""}`}
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
                        {delivery.additionalFee.toFixed(2) || "0.00"}
                      </p>
                      <p>
                        <strong>Valor total:</strong> R$
                        {(delivery.totalValue + delivery.additionalFee).toFixed(
                          2,
                        )}
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
          </ScrollArea>
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
