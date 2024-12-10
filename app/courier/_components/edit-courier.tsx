"use client";

import { Button } from "@/app/_components/ui/button";
import { DialogContent, DialogTitle } from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";

interface Courier {
  id: string;
  name: string;
  pricePerPackage: number;
}

interface EditCourierProps {
  courier: Courier;
  onChange: (courier: Courier) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void; // Adicionado para deletar o entregador
}

const EditCourier = ({
  courier,
  onChange,
  onSave,
  onCancel,
  onDelete,
}: EditCourierProps) => {
  return (
    <DialogContent>
      <DialogTitle className="mb-4 text-xl font-bold">
        Editar Entregador
      </DialogTitle>
      <div className="space-y-4">
        {/* Campo Nome */}
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            value={courier.name}
            onChange={(e) => onChange({ ...courier, name: e.target.value })}
          />
        </div>

        {/* Campo Preço por Pacote */}
        <div>
          <Label htmlFor="pricePerPackage">Preço por Pacote</Label>
          <Input
            id="pricePerPackage"
            type="number"
            name="pricePerPackage"
            value={courier.pricePerPackage}
            onChange={(e) =>
              onChange({
                ...courier,
                pricePerPackage: parseFloat(e.target.value),
              })
            }
          />
        </div>

        {/* Ações: Salvar, Cancelar e Deletar */}
        <div className="flex gap-2">
          <Button onClick={onSave}>Salvar</Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => onDelete(courier.id)}>
            Deletar
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default EditCourier;
