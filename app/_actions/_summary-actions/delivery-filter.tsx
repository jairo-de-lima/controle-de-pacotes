import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import CourierButtons from "@/app/delivery/_components/searchCourier";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

type DeliveryFilterProps = {
  selectedPerson: string;
  setSelectedPerson: (value: string) => void;
  dateRange: { from?: Date; to?: Date };
  setDateRange: (range: { from?: Date; to?: Date }) => void;
};

const DeliveryFilter: React.FC<DeliveryFilterProps> = ({
  setSelectedPerson,
  dateRange,
  setDateRange,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // Função para lidar com a seleção de datas
  const handleDateSelect = (range: { from: Date; to: Date }) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      // Verificando se ambos os valores estão definidos
      setIsCalendarOpen(false);
    }
  };

  // Função para lidar com a seleção do entregador
  const handleSelectCourier = (selectedCourier: { id: string }) => {
    setSelectedPerson(selectedCourier.id); // Aqui você pode ajustar conforme necessário
  };

  return (
    <div className="space-y-6">
      {/* Filtro de entregador */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Selecionar Entregador:
        </label>
        <CourierButtons onSelectCourier={handleSelectCourier} />
      </div>

      {/* Filtro de data */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Selecionar Período:
        </label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              <CalendarIcon className="mr-2" />
              {dateRange?.from && dateRange?.to
                ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                : "Selecione o período"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateSelect}
              disabled={(date) =>
                date > new Date() || date < new Date("1990-01-01")
              }
              initialFocus
            />

            {/* <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateSelect}
              className="rounded-md"
            /> */}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DeliveryFilter;
