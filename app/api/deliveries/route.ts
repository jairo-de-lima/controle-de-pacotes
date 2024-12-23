import { prisma } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const courierId = searchParams.get("courierId");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    console.log("courierId:", courierId);
    console.log("start:", start);
    console.log("end:", end);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (courierId) {
      where.courierId = courierId;
    }

    if (start && end) {
      where.date = {
        gte: new Date(start).toISOString(),
        lte: new Date(end).toISOString(),
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
        additionalFee: true,
        date: true,
      },
    });

    console.log("Entregas encontradas:", deliveries);

    return NextResponse.json(deliveries);
  } catch (error) {
    console.error("Erro ao buscar entregas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar entregas." },
      { status: 500 },
    );
  }
}
