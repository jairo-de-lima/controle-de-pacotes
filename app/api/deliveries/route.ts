import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";

export const GET = async (_req: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(_req.url);

    const courierId = searchParams.get("courierId");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const where: Record<string, unknown> = {};

    if (courierId) {
      where.courierId = courierId;
    }

    if (start && end) {
      where.date = {
        gte: new Date(start).toISOString(),
        lte: new Date(end).toISOString(),
      };
    }

    const deliveries = await prisma.delivery.findMany({
      where,
      select: {
        id: true,
        packages: true,
        totalValue: true,
        courierId: true,
        additionalFee: true,
        date: true,
        paid: true,
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
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const data = await req.json();

    const delivery = await prisma.delivery.create({
      data: {
        courierId: data.courierId,
        date: data.date,
        packages: data.packages,
        totalValue: data.totalValue,
        additionalFee: data.additionalFee,
        paid: data.paid,
      },
    });

    return NextResponse.json(delivery);
  } catch (error) {
    console.error("Erro ao criar entrega:", error);
    return NextResponse.json(
      { error: "Erro ao criar entrega." },
      { status: 500 },
    );
  }
};
