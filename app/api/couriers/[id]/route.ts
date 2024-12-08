import { NextResponse } from "next/server";
import { CourierCRUD } from "@/app/_config/prismaCrud";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
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
  { params }: { params: { id: string } },
) {
  const data = await req.json();
  try {
    const updatedCourier = await CourierCRUD.update(params.id, data);
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
  { params }: { params: { id: string } },
) {
  try {
    await CourierCRUD.delete(params.id);
    return NextResponse.json({ message: "Entregador deletado com sucesso." });
  } catch {
    return NextResponse.json(
      { error: "Erro ao deletar entregador." },
      { status: 500 },
    );
  }
}
