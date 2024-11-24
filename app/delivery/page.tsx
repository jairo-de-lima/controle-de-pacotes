import React from "react";
import AuthGuard from "../_components/AuthGuard";
import DeliveriesForm from "./_components/deliveries-form";

const Deliveries = () => {
  return (
    <AuthGuard>
      <div className="bg-muted-foreground-foreground flex min-h-screen items-center justify-center">
        <DeliveriesForm />
      </div>
    </AuthGuard>
  );
};

export default Deliveries;
