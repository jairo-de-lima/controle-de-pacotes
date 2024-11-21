import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/app/_components/ui/card";
import { DollarSignIcon } from "lucide-react";
import React from "react";

const SummaryDeliveries = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-muted-foreground-foreground">
      <Card className="h-full w-full">
        <CardTitle>
          <DollarSignIcon size={16} />
          Resumo de entregas
        </CardTitle>
        <CardDescription>estregas de entregadors</CardDescription>
        <CardContent>detalhamento</CardContent>
      </Card>
    </div>
  );
};

export default SummaryDeliveries;
