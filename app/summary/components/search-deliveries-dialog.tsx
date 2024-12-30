import { DeliveryAnalytics } from "@/app/_actions/_summary-actions/dellivery-analytics";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/app/_components/ui/dialog";

type SearchDeliveriesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SearchDeliveriesDialog: React.FC<SearchDeliveriesDialogProps> = ({
  isOpen,
  onClose,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="rounded-md md:max-w-[80%]">
      <DialogTitle>Analise de Entregas por período</DialogTitle>
      <DeliveryAnalytics />
    </DialogContent>
  </Dialog>
);
