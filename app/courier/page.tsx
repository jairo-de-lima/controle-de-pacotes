"use client";

import { useState } from "react";

import { useCouriers } from "@/app/_hooks/useCouriers";

// import CourierList from "./_components/CourierList";
import { CourierForm } from "./_components/courierForm";

export default function CourierPage() {
  const { couriers, refetch } = useCouriers();
  const [editingCourier, setEditingCourier] = useState(null);

  if (!couriers) {
    return;
  }
  return (
    <div>
      <CourierForm
        initialData={editingCourier}
        onSuccess={() => {
          refetch();
          setEditingCourier(null);
        }}
      />
      {/* <CourierList couriers={couriers} onEdit={setEditingCourier} /> */}
    </div>
  );
}
