"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Calendar, Package, SearchIcon } from "lucide-react";
import { useToast } from "@/app/_hooks/use-toast";
import { DeliveriesDetail } from "./details-delivery";
import { SearchDeliveriesDialog } from "./search-deliveries-dialog";
import { DeliveryPersonCard } from "./delivery-person-card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { EditDelivery } from "./edit-deliveries";
import { DeliveryFilter } from "./filter-deliveries";

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
  const [selectedPerson, setSelectedPerson] = useState<DeliveryPerson | null>(
    null,
  );
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [deliveryPeople, setDeliveryPeople] = useState<DeliveryPerson[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [deliveryToEdit, setDeliveryToEdit] = useState<Delivery | null>(null);
  const [searchDeliveries, setSearchDeliveries] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);

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
  useEffect(() => {
    setFilteredDeliveries(deliveries); // Inicialmente, exibir todas as entregas
  }, [deliveries]);

  const handleDeliveryUpdated = async () => {
    setIsEditing(false);
    setDeliveryToEdit(null);
    const updatedDeliveries = fetch("/api/deliveries").then((res) =>
      res.json(),
    );
    setDeliveries(await updatedDeliveries);
  };

  const handleCardClick = (person: DeliveryPerson) => {
    setSelectedPerson(person);
    setIsOpen(true);
  };

  const selectedPersonDeliveries = selectedPerson
    ? filteredDeliveries.filter(
        (delivery) => delivery.courierId === selectedPerson.id,
      )
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

  const handleFilter = (filter: { startDate: string; endDate: string }) => {
    const { startDate, endDate } = filter;
    const filtered = deliveries.filter((delivery) => {
      const deliveryDate = new Date(delivery.date);
      return (
        deliveryDate >= new Date(startDate) && deliveryDate <= new Date(endDate)
      );
    });
    setFilteredDeliveries(filtered);
  };

  const handleFilterDeliveriesPaid = async () => {
    if (filteredDeliveries && filteredDeliveries.length > 0) {
      try {
        // Itera sobre o array e marca cada entrega como "paid"
        const promises = filteredDeliveries.map(async (delivery) => {
          return await fetch(`/api/deliveries/${delivery.id}`, {
            // Passe o ID no caminho
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paid: true, // Atualize apenas a propriedade desejada
            }),
          });
        });

        // Aguarda todas as requisições serem concluídas
        await Promise.all(promises);

        toast({
          title: "Sucesso",
          description: "As entregas foram marcadas como pagas.",
          duration: 2000,
        });

        // Atualiza a lista localmente
        const updatedDeliveries = await fetch("/api/deliveries").then((res) =>
          res.json(),
        );
        setDeliveries(updatedDeliveries);
      } catch (error) {
        toast({
          title: "Entrega deletada com sucesso!",
          description: `Erro ao marcar entregas como pagas: ${error}`,
          duration: 2000,
        });
      }
    } else {
      toast({
        title: "Ouve um Erro",
        description: "Nenhuma entrega selecionada para marcar como paga.",
        duration: 2000,
      });
    }
  };

  const getCurrentQuinzena = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1; // Mês começa em 0
    const currentYear = today.getFullYear();

    if (currentDay <= 15) {
      return {
        startDate: new Date(currentYear, currentMonth - 1, 1),
        endDate: new Date(currentYear, currentMonth - 1, 15),
      };
    } else {
      return {
        startDate: new Date(currentYear, currentMonth - 1, 16),
        endDate: new Date(currentYear, currentMonth, 0), // Último dia do mês
      };
    }
  };

  // Atualiza os deliveries filtrados com base na quinzena atual
  useEffect(() => {
    const { startDate, endDate } = getCurrentQuinzena();

    const filtered = deliveries.filter((delivery) => {
      const deliveryDate = new Date(delivery.date);
      return deliveryDate >= startDate && deliveryDate <= endDate;
    });

    setFilteredDeliveries(filtered);
  }, [deliveries]);

  return (
    <div className="bg-muted-foreground-foreground mb-4 mt-20 flex w-[80%] flex-col items-center justify-center">
      <div className="mb-4 flex w-full items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Package size={20} />
          Resumo de entregas
        </h1>
        <div className="flex gap-1">
          <Button
            variant="link"
            onClick={() => {
              setIsFilterOpen(true);
            }}
          >
            <Calendar size={20} />
          </Button>
          <Button variant="link" onClick={openSearchDeliveries}>
            <SearchIcon size={20} />
          </Button>
        </div>
      </div>

      <SearchDeliveriesDialog
        isOpen={searchDeliveries}
        onClose={() => setSearchDeliveries(false)}
      />

      <DeliveryFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilter={handleFilter}
        onPaid={handleFilterDeliveriesPaid}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {deliveryPeople
          .filter((person) =>
            filteredDeliveries.some(
              (delivery) => delivery.courierId === person.id,
            ),
          )
          .map((person) => {
            const personDeliveries = filteredDeliveries.filter(
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
                onClick={() => handleCardClick(person)} // Passar o objeto completo
              />
            );
          })}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[90%] rounded-md">
          <DialogHeader>
            <DialogTitle className="flex w-full justify-center gap-2">
              Entregas de {selectedPerson?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            {/* Passar o preço por pacote */}
            <DeliveriesDetail
              deliveries={selectedPersonDeliveries}
              onDelete={handleDelete}
              onEdit={handleEdit}
              pricePerPackage={selectedPerson?.pricePerPackage}
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
