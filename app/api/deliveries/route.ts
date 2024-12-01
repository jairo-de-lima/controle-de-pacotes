import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma"; // Caminho do seu prisma client

export async function GET() {
  try {
    const deliveries = await prisma.delivery.findMany({
      select: {
        id: true,
        packages: true,
        totalValue: true,
        courierId: true,
      },
    });
    return NextResponse.json(deliveries);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar entregas." },
      { status: 500 },
    );
  }
}
