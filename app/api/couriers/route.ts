import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { getToken } from "next-auth/jwt";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const token = await getToken({ req });
    if (!token?.companyId) {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 401 },
      );
    }

    const couriers = await prisma.courier.findMany({
      where: {
        companyId: token.companyId, // Filtra os entregadores pelo companyId
      },
      select: {
        id: true,
        name: true,
        pricePerPackage: true,
      },
    });

    return NextResponse.json(couriers);
  } catch (error) {
    console.error("Erro ao buscar entregadores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar entregadores." },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const token = await getToken({ req });
    if (!token?.companyId) {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 401 },
      );
    }

    const data = await req.json();
    if (!data.name || !data.pricePerPackage) {
      return NextResponse.json(
        { error: "Nome e preço por pacote são obrigatórios." },
        { status: 400 },
      );
    }

    const courier = await prisma.courier.create({
      data: {
        name: data.name,
        pricePerPackage: data.pricePerPackage,
        companyId: token.companyId, // Associa o entregador ao companyId do token
      },
    });

    return NextResponse.json(courier, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar entregador:", error);
    return NextResponse.json(
      { error: "Erro ao criar entregador." },
      { status: 500 },
    );
  }
};
