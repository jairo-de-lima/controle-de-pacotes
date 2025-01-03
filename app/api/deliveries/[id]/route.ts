import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DeliveryCRUD } from "@/app/_config/prismaCrud";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";

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

export const GET = async (
  req: NextRequest,
  context: Context,
): Promise<NextResponse> => {
  try {
    const token = await getToken({ req });
    if (!token?.companyId) {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 401 },
      );
    }

    const delivery = await DeliveryCRUD.readById(context.params.id);

    if (!delivery || delivery.companyId !== token.companyId) {
      return NextResponse.json(
        { error: "Entrega não encontrada ou não autorizada." },
        { status: 404 },
      );
    }

    return NextResponse.json(delivery);
  } catch (error) {
    console.error("Erro ao buscar entrega:", error);
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
  try {
    const token = await getToken({ req });
    if (!token?.companyId) {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 401 },
      );
    }

    const data: DeliveryData = await req.json();
    const existingDelivery = await DeliveryCRUD.readById(context.params.id);

    if (!existingDelivery || existingDelivery.companyId !== token.companyId) {
      return NextResponse.json(
        { error: "Entrega não encontrada ou não autorizada." },
        { status: 404 },
      );
    }

    const updatedDelivery = await DeliveryCRUD.update(context.params.id, data);
    revalidatePath("/summary");
    return NextResponse.json(updatedDelivery);
  } catch (error) {
    console.error("Erro ao atualizar entrega:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar entrega." },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  context: Context,
): Promise<NextResponse> => {
  try {
    const token = await getToken({ req });
    if (!token?.companyId) {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 401 },
      );
    }

    const existingDelivery = await DeliveryCRUD.readById(context.params.id);

    if (!existingDelivery || existingDelivery.companyId !== token.companyId) {
      return NextResponse.json(
        { error: "Entrega não encontrada ou não autorizada." },
        { status: 404 },
      );
    }

    await DeliveryCRUD.delete(context.params.id);
    revalidatePath("/summary");
    return NextResponse.json({ message: "Entrega deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar entrega:", error);
    return NextResponse.json(
      { error: "Erro ao deletar entrega." },
      { status: 500 },
    );
  }
};
