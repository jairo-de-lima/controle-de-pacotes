import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DeliveryCRUD } from "@/app/_config/prismaCrud";
import { revalidatePath } from "next/cache";

interface DeliveryData {
  id: string;
  courierId: string;
  date: Date;
  packages: number;
  additionalFee: number;
  totalValue: number;
  paid: boolean;
  companyId: string;
}

type Context = {
  params: {
    id: string;
  };
};

// Usando const e arrow functions para os handlers
export const GET = async (
  _req: NextRequest,
  context: Context,
): Promise<NextResponse> => {
  try {
    const delivery = await DeliveryCRUD.readById(context.params.id);
    if (!delivery) {
      return NextResponse.json(
        { error: "Entrega não encontrada." },
        { status: 404 },
      );
    }
    return NextResponse.json(delivery);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar entrega." },
      { status: 500 },
    );
  }
};

export const PUT = async (
  req: NextRequest,
  context: Context,
): Promise<NextResponse> => {
  const data: DeliveryData = await req.json();
  try {
    const updatedDelivery = await DeliveryCRUD.update(context.params.id, data);
    revalidatePath("/summary");
    return NextResponse.json(updatedDelivery);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar entrega." },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _req: NextRequest,
  context: Context,
): Promise<NextResponse> => {
  try {
    await DeliveryCRUD.delete(context.params.id);
    revalidatePath("/summary");
    return NextResponse.json({ message: "Entrega deletada com sucesso." });
  } catch {
    return NextResponse.json(
      { error: "Erro ao deletar entrega." },
      { status: 500 },
    );
  }
};
