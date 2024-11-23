import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_lib/prisma";
import bcrypt from "bcryptjs"; // Para criptografar a senha

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const companies = await prisma.company.findMany();
      return res.status(200).json(companies);
    } catch (error) {
      console.error("Erro ao buscar companhias:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ error: "Nome, e-mail e senha são obrigatórios." });
      }

      // Criptografar a senha antes de salvar
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar a nova companhia
      const newCompany = await prisma.company.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return res.status(201).json(newCompany);
    } catch (error) {
      console.error("Erro ao criar companhia:", error);

      // Verifica se é um erro de duplicidade no e-mail
      if (error.code === "P2002") {
        return res.status(409).json({
          error: "Uma companhia com esse e-mail já existe.",
        });
      }

      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
