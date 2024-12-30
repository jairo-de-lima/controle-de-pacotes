import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { User } from "lucide-react";

type DeliveryPerson = {
  id: string;
  name: string;
};

type DeliveryPersonCardProps = {
  person: DeliveryPerson;
  totalDeliveries: number;
  totalValue: number;
  onClick: () => void;
};

export const DeliveryPersonCard: React.FC<DeliveryPersonCardProps> = ({
  person,
  totalDeliveries,
  totalValue,
  onClick,
}) => (
  <Card
    key={person.id}
    className="cursor-pointer shadow-md hover:shadow-lg"
    onClick={onClick}
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
