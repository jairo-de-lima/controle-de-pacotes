import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CourierCRUD } from "@/app/_config/prismaCrud";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";

interface CourierData {
  id: string;
  name: string;
  pricePerPackage: number;
  companyId: string;
}

type Context = {
  params: {
    id: string;
  };
};

// Middleware para verificar se o courier pertence à companyId do usuário autenticado
const verifyCompanyOwnership = async (
  req: NextRequest,
  courierId: string,
): Promise<boolean> => {
  const token = await getToken({ req });
  if (!token?.companyId) {
    return false;
  }

  const courier = await CourierCRUD.readById(courierId);
  if (!courier || courier.companyId !== token.companyId) {
    return false;
  }

  return true;
};

// GET Handler
export const GET = async (
  req: NextRequest,
  context: Context,
): Promise<NextResponse> => {
  try {
    const hasAccess = await verifyCompanyOwnership(req, context.params.id);
    if (!hasAccess) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const courier = await CourierCRUD.readById(context.params.id);
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
};

// PUT Handler
export const PUT = async (
  req: NextRequest,
  context: Context,
): Promise<NextResponse> => {
  const data: CourierData = await req.json();
  try {
    const hasAccess = await verifyCompanyOwnership(req, context.params.id);
    if (!hasAccess) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const updatedCourier = await CourierCRUD.update(context.params.id, data);
    revalidatePath("/courier");
    return NextResponse.json(updatedCourier);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar entregador." },
      { status: 500 },
    );
  }
};

// DELETE Handler
export const DELETE = async (
  req: NextRequest,
  context: Context,
): Promise<NextResponse> => {
  try {
    const hasAccess = await verifyCompanyOwnership(req, context.params.id);
    if (!hasAccess) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    await CourierCRUD.delete(context.params.id);
    revalidatePath("/courier");
    return NextResponse.json({ message: "Entregador deletado com sucesso." });
  } catch {
    return NextResponse.json(
      { error: "Erro ao deletar entregador." },
      { status: 500 },
    );
  }
};
