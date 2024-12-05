import { prisma } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const courierId = searchParams.get("courierId");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    // Log para depuração
    console.log("courierId:", courierId);
    console.log("start:", start);
    console.log("end:", end);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Filtrando por courierId
    if (courierId) {
      where.courierId = courierId;
    }

    // Filtrando por data
    if (start && end) {
      where.date = {
        gte: new Date(start), // Data inicial
        lte: new Date(end), // Data final
      };
    }

    console.log("Query filters:", where);

    const deliveries = await prisma.delivery.findMany({
      where,
      select: {
        id: true,
        packages: true,
        totalValue: true,
        courierId: true,
        date: true, // Usando o campo `date` para a data
      },
    });

    return NextResponse.json(deliveries);
  } catch (error) {
    console.error("Erro ao buscar entregas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar entregas." },
      { status: 500 },
    );
  }
}
