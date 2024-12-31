"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";

import { addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";

type DeliveryFilterProps = {
  onFilter: (filter: { startDate: string; endDate: string }) => void;
  isOpen: boolean;
  onClose: () => void;
};

export function DeliveryFilter({
  onFilter,
  isOpen,
  onClose,
}: DeliveryFilterProps) {
  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: today,
  });

  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
  };

  const handleApplyFilter = () => {
    if (date?.from && date?.to) {
      // Ajusta as datas para incluir o dia todo
      const startDate = new Date(date.from);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date.to);
      endDate.setHours(23, 59, 59, 999);

      onFilter({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      onClose();
    }
  };

  const applyPredefinedFilter = (filter: "week" | "fortnight" | "month") => {
    const now = new Date();
    let from: Date;
    let to: Date;

    if (filter === "week") {
      from = new Date(now);
      from.setDate(now.getDate() - now.getDay());
      from.setHours(0, 0, 0, 0);
      to = addDays(from, 6);
      to.setHours(23, 59, 59, 999);
    } else if (filter === "fortnight") {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      if (now.getDate() <= 15) {
        to = new Date(now.getFullYear(), now.getMonth(), 15);
      } else {
        from = new Date(now.getFullYear(), now.getMonth(), 16);
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
    } else {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
    }

    setDate({ from, to });
    onFilter({
      startDate: from.toISOString(),
      endDate: to.toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-md rounded-md">
        <DialogHeader>
          <DialogTitle>Filtrar Entregas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="w-auto rounded-md border">
            <Calendar
              mode="range"
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={1}
              disabled={(date) =>
                date > new Date() || date < new Date("1990-01-01")
              }
              locale={ptBR}
              className="flex w-full flex-col items-center justify-center rounded-md"
              captionLayout="dropdown-buttons"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              onClick={() => applyPredefinedFilter("week")}
            >
              Semana
            </Button>
            <Button
              variant="secondary"
              onClick={() => applyPredefinedFilter("fortnight")}
            >
              Quinzena
            </Button>
            <Button
              variant="secondary"
              onClick={() => applyPredefinedFilter("month")}
            >
              Mês
            </Button>
          </div>

          <Button
            variant="default"
            onClick={handleApplyFilter}
            className="w-full"
            disabled={!date?.from || !date?.to}
          >
            Aplicar Filtro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
