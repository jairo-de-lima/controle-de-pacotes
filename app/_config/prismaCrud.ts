import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CRUD para o modelo User
export const UserCRUD = {
  create: async (data: { email: string; name?: string }) => {
    return await prisma.user.create({ data });
  },
  readAll: async () => {
    return await prisma.user.findMany();
  },
  readById: async (id: string) => {
    return await prisma.user.findUnique({ where: { id } });
  },
  update: async (id: string, data: { email?: string; name?: string }) => {
    return await prisma.user.update({ where: { id }, data });
  },
  delete: async (id: string) => {
    return await prisma.user.delete({ where: { id } });
  },
};

// CRUD para o modelo Company
export const CompanyCRUD = {
  create: async (data: { name: string; email: string; password: string }) => {
    return await prisma.company.create({ data });
  },
  readAll: async () => {
    return await prisma.company.findMany();
  },
  readById: async (id: string) => {
    return await prisma.company.findUnique({ where: { id } });
  },
  update: async (
    id: string,
    data: { name?: string; email?: string; password?: string },
  ) => {
    return await prisma.company.update({ where: { id }, data });
  },
  delete: async (id: string) => {
    return await prisma.company.delete({ where: { id } });
  },
};

// CRUD para o modelo Courier
export const CourierCRUD = {
  create: async (data: {
    name: string;
    pricePerPackage: number;
    companyId: string;
  }) => {
    return await prisma.courier.create({ data });
  },
  readAll: async () => {
    return await prisma.courier.findMany();
  },
  readById: async (id: string) => {
    return await prisma.courier.findUnique({ where: { id } });
  },
  update: async (
    id: string,
    data: { name?: string; pricePerPackage?: number; companyId?: string },
  ) => {
    return await prisma.courier.update({ where: { id }, data });
  },
  delete: async (id: string) => {
    return await prisma.courier.delete({ where: { id } });
  },
};

// CRUD para o modelo Delivery
export const DeliveryCRUD = {
  create: async (data: {
    courierId: string;
    date?: Date;
    packages: number;
    additionalFee?: number;
    totalValue?: number;
    companyId: string;
  }) => {
    return await prisma.delivery.create({ data });
  },
  readAll: async () => {
    return await prisma.delivery.findMany();
  },
  readById: async (id: string) => {
    return await prisma.delivery.findUnique({ where: { id } });
  },
  update: async (
    id: string,
    data: {
      courierId?: string;
      date?: Date;
      packages?: number;
      additionalFee?: number;
      totalValue?: number;
      companyId?: string;
    },
  ) => {
    return await prisma.delivery.update({ where: { id }, data });
  },
  delete: async (id: string) => {
    return await prisma.delivery.delete({ where: { id } });
  },
};

// Exportando o PrismaClient para reutilização em outros módulos, se necessário
export default prisma;
