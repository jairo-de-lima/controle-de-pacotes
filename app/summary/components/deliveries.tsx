"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Package, SearchIcon } from "lucide-react";
import { useToast } from "@/app/_hooks/use-toast";
import { DeliveriesDetail } from "./details-delivery";
import { SearchDeliveriesDialog } from "./search-deliveries-dialog";
import { DeliveryPersonCard } from "./delivery-person-card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { EditDelivery } from "./edit-deliveries";

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
        <Button variant="link" onClick={openSearchDeliveries}>
          <SearchIcon size={20} />
        </Button>
      </div>

      <SearchDeliveriesDialog
        isOpen={searchDeliveries}
        onClose={() => setSearchDeliveries(false)}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {deliveryPeople
          .filter((person) =>
            deliveries.some((delivery) => delivery.courierId === person.id),
          )
          .map((person) => {
            const personDeliveries = deliveries.filter(
              (delivery) => delivery.courierId === person.id,
            );
            const totalDeliveries = personDeliveries.length;
            const totalValue =
              person.pricePerPackage *
                personDeliveries.reduce(
                  (acc, delivery) => acc + delivery.packages,
                  0,
                ) +
              personDeliveries.reduce(
                (acc, delivery) => acc + delivery.additionalFee,
                0,
              );

            return (
              <DeliveryPersonCard
                key={person.id}
                person={person}
                totalDeliveries={totalDeliveries}
                totalValue={totalValue}
                onClick={() => handleCardClick(person.id)}
              />
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
            <DeliveriesDetail
              deliveries={selectedPersonDeliveries}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {deliveryToEdit && isEditing && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="w-[90%] rounded-md">
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
