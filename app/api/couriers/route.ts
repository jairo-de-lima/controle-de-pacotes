import { NextResponse } from "next/server";
import { CourierCRUD } from "@/app/_config/prismaCrud";

export async function GET() {
  try {
    const couriers = await CourierCRUD.readAll();
    return NextResponse.json(couriers);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar entregadores." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const newCourier = await CourierCRUD.create(data);
    return NextResponse.json(newCourier, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar entregador." },
      { status: 500 },
    );
  }
}
