import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma"; // Caminho do seu prisma client

export async function GET() {
  try {
    const couriers = await prisma.courier.findMany({
      select: {
        id: true,
        name: true,
        pricePerPackage: true,
      },
    });
    return NextResponse.json(couriers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar entregadores." },
      { status: 500 },
    );
  }
}
