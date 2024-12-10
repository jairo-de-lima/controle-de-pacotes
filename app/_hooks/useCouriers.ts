"use client";

import { useState, useEffect } from "react";
import { Courier } from "@prisma/client";
import { getCouriers } from "../_actions/_courier-actions/courier";

export function useCouriers() {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCouriers = async () => {
    setLoading(true);
    const data = await getCouriers();
    setCouriers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  return { couriers, loading, refetch: fetchCouriers };
}
