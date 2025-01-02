import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";

export const GET = async (_req: NextRequest): Promise<NextResponse> => {
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
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const data = await req.json();
    const courier = await prisma.courier.create({
      data: {
        name: data.name,
        pricePerPackage: data.pricePerPackage,
      },
    });
    return NextResponse.json(courier);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar entregador." },
      { status: 500 },
    );
  }
};

// /couriers/route.ts - GET (listar todos) e POST (criar novo)
// /couriers/[id]/route.ts - GET (buscar por id), PUT (atualizar) e DELETE (remover)
