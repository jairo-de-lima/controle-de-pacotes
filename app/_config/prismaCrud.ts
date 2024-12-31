import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// CRUD para o modelo User
export const UserCRUD = {
  create: async (data: Prisma.UserCreateInput) => {
    try {
      return await prisma.user.create({ data });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw new Error("Erro ao criar usuário");
    }
  },
  readAll: async () => {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw new Error("Erro ao buscar usuários");
    }
  },
  readById: async (id: string) => {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw new Error("Erro ao buscar usuário");
    }
  },
  update: async (id: string, data: Prisma.UserUpdateInput) => {
    try {
      return await prisma.user.update({ where: { id }, data });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw new Error("Erro ao atualizar usuário");
    }
  },
  delete: async (id: string) => {
    try {
      return await prisma.user.delete({ where: { id } });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw new Error("Erro ao deletar usuário");
    }
  },
};

// CRUD para o modelo Company
export const CompanyCRUD = {
  create: async (data: Prisma.CompanyCreateInput) => {
    try {
      return await prisma.company.create({ data });
    } catch (error) {
      console.error("Erro ao criar empresa:", error);
      throw new Error("Erro ao criar empresa");
    }
  },
  readAll: async () => {
    try {
      return await prisma.company.findMany();
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      throw new Error("Erro ao buscar empresas");
    }
  },
  readById: async (id: string) => {
    try {
      return await prisma.company.findUnique({ where: { id } });
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
      throw new Error("Erro ao buscar empresa");
    }
  },
  update: async (id: string, data: Prisma.CompanyUpdateInput) => {
    try {
      return await prisma.company.update({ where: { id }, data });
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      throw new Error("Erro ao atualizar empresa");
    }
  },
  delete: async (id: string) => {
    try {
      return await prisma.company.delete({ where: { id } });
    } catch (error) {
      console.error("Erro ao deletar empresa:", error);
      throw new Error("Erro ao deletar empresa");
    }
  },
};

// CRUD para o modelo Courier
export const CourierCRUD = {
  create: async (data: Prisma.CourierCreateInput) => {
    try {
      return await prisma.courier.create({ data });
    } catch (error) {
      console.error("Erro ao criar entregador:", error);
      throw new Error("Erro ao criar entregador");
    }
  },
  readAll: async () => {
    try {
      return await prisma.courier.findMany();
    } catch (error) {
      console.error("Erro ao buscar entregadores:", error);
      throw new Error("Erro ao buscar entregadores");
    }
  },
  readById: async (id: string) => {
    try {
      return await prisma.courier.findUnique({ where: { id } });
    } catch (error) {
      console.error("Erro ao buscar entregador:", error);
      throw new Error("Erro ao buscar entregador");
    }
  },
  update: async (id: string, data: Prisma.CourierUpdateInput) => {
    try {
      return await prisma.courier.update({ where: { id }, data });
    } catch (error) {
      console.error("Erro ao atualizar entregador:", error);
      throw new Error("Erro ao atualizar entregador");
    }
  },
  delete: async (id: string) => {
    try {
      return await prisma.courier.delete({ where: { id } });
    } catch (error) {
      console.error("Erro ao deletar entregador:", error);
      throw new Error("Erro ao deletar entregador");
    }
  },
};

// CRUD para o modelo Delivery
export const DeliveryCRUD = {
  create: async (data: Prisma.DeliveryCreateInput) => {
    try {
      return await prisma.delivery.create({ data });
    } catch (error) {
      console.error("Erro ao criar entrega:", error);
      throw new Error("Erro ao criar entrega");
    }
  },
  readAll: async () => {
    try {
      return await prisma.delivery.findMany();
    } catch (error) {
      console.error("Erro ao buscar entregas:", error);
      throw new Error("Erro ao buscar entregas");
    }
  },
  readById: async (id: string) => {
    try {
      return await prisma.delivery.findUnique({ where: { id } });
    } catch (error) {
      console.error("Erro ao buscar entrega:", error);
      throw new Error("Erro ao buscar entrega");
    }
  },
  update: async (id: string, data: Prisma.DeliveryUpdateInput) => {
    try {
      return await prisma.delivery.update({ where: { id }, data });
    } catch (error) {
      console.error("Erro ao atualizar entrega:", error);
      throw new Error("Erro ao atualizar entrega");
    }
  },
  delete: async (id: string) => {
    try {
      return await prisma.delivery.delete({ where: { id } });
    } catch (error) {
      console.error("Erro ao deletar entrega:", error);
      throw new Error("Erro ao deletar entrega");
    }
  },
};

// Exportando o PrismaClient para reutilização em outros módulos
export default prisma;
