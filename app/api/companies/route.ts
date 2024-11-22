import { NextRequest, NextResponse } from "next/server";
// ajuste o caminho conforme necessário
import bcrypt from "bcryptjs";
import { prisma } from "../../_lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // Verifica se já existe uma empresa com este nome ou email
    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [{ email }, { name }],
      },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "Empresa já cadastrada com este nome ou email" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await prisma.company.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        company,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    return NextResponse.json(
      { error: "Erro ao criar empresa" },
      { status: 500 }
    );
  }
}
