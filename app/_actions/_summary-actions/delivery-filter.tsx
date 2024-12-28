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
  setSelectedPerson: (value: { id: string; name: string }) => void;
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
  const handleDateSelect = (range: { from?: Date; to?: Date }) => {
    setDateRange({
      from: range?.from || dateRange.from,
      to: range?.to || dateRange.to,
    });
  };

  // Função para lidar com a seleção do entregador
  const handleCourierSelect = (selectedCourier: {
    id: string;
    name: string;
    pricePerPackage: number;
  }) => {
    setSelectedPerson({
      id: selectedCourier.id,
      name: selectedCourier.name,
    }); // Passando id e name para o estado
  };

  return (
    <div className="flex gap-4">
      {/* Filtro de entregador */}
      <div className="mt-2 w-full flex-1">
        <CourierButtons onSelectCourier={handleCourierSelect} />
      </div>

      {/* Filtro de data */}
      <div className="mt-2 w-full flex-1">
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
