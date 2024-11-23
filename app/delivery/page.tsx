import React from "react";
import AuthGuard from "../_components/AuthGuard";
import SummaryDeliveries from "./_components/summary";

const Deliveries = () => {
  return (
    <AuthGuard>
      <div className="bg-muted-foreground-foreground flex min-h-screen items-center justify-center">
        <SummaryDeliveries />
      </div>
    </AuthGuard>
  );
};

export default Deliveries;
