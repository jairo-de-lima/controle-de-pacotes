"use server";

import { CourierCRUD } from "@/app/_config/prismaCrud";

const SearchCourier = async () => {
  try {
    // Lê todos os couriers do banco
    const couriers = await CourierCRUD.readAll();

    // Verifica se existem couriers
    if (!couriers || couriers.length === 0) return [];

    // Retorna o array com os IDs e nomes dos couriers
    return couriers.map((courier) => ({
      id: courier.id,
      name: courier.name,
    }));
  } catch (error) {
    console.error("Erro ao buscar couriers:", error);
    return [];
  }
};

export default SearchCourier;
