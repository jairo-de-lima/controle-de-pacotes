import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import CourierButtons from "@/app/delivery/_components/searchCourier";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

type DeliveryFilterProps = {
  selectedPerson: string;
  setSelectedPerson: (value: { id: string; name: string }) => void;
  dateRange: { from?: Date; to?: Date };
  setDateRange: (range: { from?: Date; to?: Date }) => void;
};

const DeliveryFilter: React.FC<DeliveryFilterProps> = ({
  setSelectedPerson,
  dateRange,
  setDateRange,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Seleção de datas
  const handleDateSelect = (range: { from?: Date; to?: Date }) => {
    setDateRange({
      from: range?.from,
      to: range?.to,
    });
  };

  // Seleção do entregador
  const handleCourierSelect = (selectedCourier: {
    id: string;
    name: string;
    pricePerPackage: number;
  }) => {
    setSelectedPerson({
      id: selectedCourier.id,
      name: selectedCourier.name,
    });
  };

  return (
    <div className="flex gap-4">
      {/* Filtro de entregador */}
      <div className="mt-2 w-full flex-1">
        <CourierButtons onSelectCourier={handleCourierSelect} />
      </div>

      {/* Filtro de data */}
      <div className="mt-2 w-full flex-1">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <CalendarIcon className="mr-2" />
              {dateRange?.from && dateRange?.to
                ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                : "Selecione o período"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Selecionar Período</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date > new Date() || date < new Date("1990-01-01")
                }
                initialFocus
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setDateRange({ from: undefined, to: undefined });
                  setIsDialogOpen(false);
                }}
              >
                Limpar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Confirmar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DeliveryFilter;
