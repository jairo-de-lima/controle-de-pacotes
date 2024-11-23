// actions/courierActions.ts
"use server";

import { CourierCRUD } from "@/app/_config/prismaCrud";

export async function createCourier({
  name,
  pricePerPackage,
  companyId,
}: {
  name: string;
  pricePerPackage: number;
  companyId: string;
}) {
  if (!companyId) {
    throw new Error("Erro: Usuário não está associado a nenhuma empresa.");
  }

  try {
    await CourierCRUD.create({
      name,
      pricePerPackage,
      companyId,
    });
    return { success: true, message: "Entregador cadastrado com sucesso!" };
  } catch (error) {
    console.error("Erro ao cadastrar entregador:", error);
    throw new Error("Erro ao cadastrar entregador. Tente novamente.");
  }
}
