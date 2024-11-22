import AuthGuard from "../_components/AuthGuard";
import SummaryDeliveries from "./_components/summary";

const Deliveries = () => {
  return (
    <AuthGuard>
      <div className="flex items-center justify-center min-h-screen bg-muted-foreground-foreground">
        <SummaryDeliveries />
      </div>
    </AuthGuard>
  );
};

export default Deliveries;
