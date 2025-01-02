import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CourierCRUD } from "@/app/_config/prismaCrud";
import { revalidatePath } from "next/cache";

interface CourierData {
  id: string;
  name: string;
  pricePerPackage: number;
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
    const courier = await CourierCRUD.readById(context.params.id);
    if (!courier) {
      return NextResponse.json(
        { error: "Entregador não encontrado." },
        { status: 404 },
      );
    }
    return NextResponse.json(courier);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar entregador." },
      { status: 500 },
    );
  }
};

export const PUT = async (
  req: NextRequest,
  context: Context,
): Promise<NextResponse> => {
  const data: CourierData = await req.json();
  try {
    const updatedCourier = await CourierCRUD.update(context.params.id, data);
    revalidatePath("/courier");
    return NextResponse.json(updatedCourier);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar entregador." },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _req: NextRequest,
  context: Context,
): Promise<NextResponse> => {
  try {
    await CourierCRUD.delete(context.params.id);
    revalidatePath("/courier");
    return NextResponse.json({ message: "Entregador deletado com sucesso." });
  } catch {
    return NextResponse.json(
      { error: "Erro ao deletar entregador." },
      { status: 500 },
    );
  }
};
