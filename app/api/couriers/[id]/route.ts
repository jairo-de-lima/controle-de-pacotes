import { NextResponse } from "next/server";
import { CourierCRUD } from "@/app/_config/prismaCrud";
import { revalidatePath } from "next/cache";

interface CourierParams {
  id: string;
}

interface CourierData {
  // Defina a estrutura esperada dos dados do entregador
  name: string;
  // Adicione outros campos conforme necessário
}

export async function GET(
  req: Request,
  { params }: { params: CourierParams },
): Promise<NextResponse> {
  try {
    const courier = await CourierCRUD.readById(params.id);
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
}

export async function PUT(
  req: Request,
  { params }: { params: CourierParams },
): Promise<NextResponse> {
  const data: CourierData = await req.json(); // Defina o tipo dos dados recebidos
  try {
    const updatedCourier = await CourierCRUD.update(params.id, data);

    // Revalidar o cache antes de retornar a resposta
    revalidatePath("/courier");

    return NextResponse.json(updatedCourier);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar entregador." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: CourierParams },
): Promise<NextResponse> {
  try {
    await CourierCRUD.delete(params.id);

    // Revalidar o cache antes de retornar a resposta
    revalidatePath("/courier");

    return NextResponse.json({ message: "Entregador deletado com sucesso." });
  } catch {
    return NextResponse.json(
      { error: "Erro ao deletar entregador." },
      { status: 500 },
    );
  }
}
