import { Button } from "@/app/_components/ui/button";
import { ToastAction } from "@/app/_components/ui/toast";
import { useToast } from "@/app/_hooks/use-toast";
import { Delivery } from "@prisma/client";
import { PencilIcon, Save, TrashIcon } from "lucide-react";

type DeliveriesDetailProps = {
  deliveries: Delivery[];
  selectedPerson: string | null; // Adicionado para referência
  pricePerPackage: number; // Adicionado para cálculo do total
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export const DeliveriesDetail: React.FC<DeliveriesDetailProps> = ({
  deliveries,
  selectedPerson,
  pricePerPackage,
  onDelete,
  onEdit,
}) => {
  const { toast, dismiss } = useToast();

  const confirmDelete = (deliveryId: string): void => {
    toast({
      variant: "destructive",
      title: "Tem certeza?",
      description: "Você não poderá recuperar esta entrega.",
      duration: 10000,
      action: (
        <ToastAction
          altText="Confirmar exclusão"
          className="flex flex-col border-none"
        >
          <div className="flex gap-2">
            <Button
              className="bg-blue-200"
              variant="secondary"
              onClick={() => {
                dismiss(); // Fechar o toast ao cancelar
              }}
            >
              <Save size={20} />
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                onDelete(deliveryId); // Executa a exclusão
                dismiss(); // Fechar o toast após exclusão
              }}
            >
              <TrashIcon size={20} />
            </Button>
          </div>
        </ToastAction>
      ),
    });
  };

  return (
    <div className="space-y-4">
      {deliveries.length > 0 ? (
        deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className={`flex w-full items-center justify-between gap-2 rounded-md border p-4 shadow-sm ${
              delivery.paid ? "bg-muted-foreground" : ""
            }`}
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
                {(
                  delivery.packages * pricePerPackage +
                  delivery.additionalFee
                ).toFixed(2)}
              </p>
            </div>
            <div className="mr-0 flex">
              <Button
                variant="destructive"
                className="mr-2"
                onClick={() => confirmDelete(delivery.id)}
              >
                <TrashIcon size={18} />
              </Button>
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => onEdit(delivery.id)}
              >
                <PencilIcon size={18} />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p>Não há entregas registradas para este entregador.</p>
      )}
    </div>
  );
};
