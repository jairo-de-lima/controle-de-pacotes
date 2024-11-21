import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const companies = await prisma.company.findMany();
    return res.status(200).json(companies);
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
