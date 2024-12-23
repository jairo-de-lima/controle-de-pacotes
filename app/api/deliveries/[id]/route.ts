import { NextResponse } from "next/server";
import { DeliveryCRUD } from "@/app/_config/prismaCrud";
import { revalidatePath } from "next/cache";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const courier = await DeliveryCRUD.readById(params.id);
    if (!courier) {
      return NextResponse.json(
        { error: "Entrega nao encontrada" },
        { status: 404 },
      );
    }
    return NextResponse.json(courier);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar entregas." },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const data = await req.json();
  try {
    const updatedCourier = await DeliveryCRUD.update(params.id, data);

    // Revalidar o cache antes de retornar a resposta
    revalidatePath("/summary");

    return NextResponse.json(updatedCourier);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar entrega." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await DeliveryCRUD.delete(params.id);

    // Revalidar o cache antes de retornar a resposta
    revalidatePath("/summary");

    return NextResponse.json({ message: "Entega deletado com sucesso." });
  } catch {
    return NextResponse.json(
      { error: "Erro ao deletar Entrega." },
      { status: 500 },
    );
  }
}
