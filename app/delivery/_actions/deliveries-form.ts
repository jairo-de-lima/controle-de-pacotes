"use server";

import { DeliveryCRUD } from "@/app/_config/prismaCrud";

interface CreateDeliveriesProps {
  courierId: string;
  date: Date;
  packages: number;
  additionalFee: number;
  totalValue: number;
  companyId: string;
}

export async function CreateDeliveries({
  date,
  courierId,
  packages,
  additionalFee,
  totalValue,
  companyId,
}: CreateDeliveriesProps) {
  if (!courierId) {
    throw new Error("Courier ID is required");
  }
  try {
    await DeliveryCRUD.upsert({
      courierId,
      date,
      packages,
      additionalFee,
      totalValue,
      companyId,
    });
    return { success: true, message: "Dados registrados com sucesso!" };
  } catch {
    return { success: false, message: "Erro ao registrar dados!" };
  }
}
