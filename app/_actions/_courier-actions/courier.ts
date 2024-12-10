"use server";

import { prisma } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrUpdateCourier(data: {
  id?: string;
  name: string;
  pricePerPackage: number;
  companyId: string;
}) {
  try {
    const courier = await prisma.courier.upsert({
      where: { id: data.id || "" },
      update: {
        name: data.name,
        pricePerPackage: data.pricePerPackage,
      },
      create: {
        name: data.name,
        pricePerPackage: data.pricePerPackage,
        companyId: data.companyId,
      },
    });

    revalidatePath("/courier");
    return { success: true, courier };
  } catch (error) {
    console.error("Erro ao criar/atualizar entregador:", error);
    return { success: false, error };
  }
}

export async function deleteCourier(id: string) {
  try {
    await prisma.courier.delete({ where: { id } });
    revalidatePath("/courier");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar entregador:", error);
    return { success: false, error };
  }
}

export async function getCouriers() {
  return await prisma.courier.findMany();
}
