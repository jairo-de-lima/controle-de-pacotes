import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/app/_components/ui/card";
import { DollarSignIcon, Search } from "lucide-react";
import React from "react";
import AuthGuard from "../_components/AuthGuard";

const Summary = () => {
  return (
    <AuthGuard>
      <div className="min-w-screen bg-muted-foreground-foreground flex min-h-screen flex-col items-center justify-center">
        <Card className="flex h-full w-full flex-col items-center gap-2">
          <CardTitle>
            <div className="flex items-center justify-between gap-2">
              <DollarSignIcon size={18} /> <h1>Resumo de Entregas</h1>
              <Button variant="outline" className="border-none">
                <Search size={18} />
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Escolha o entregador</CardDescription>
          <CardContent>
            codigo para renderizar os entregadores aqui!!
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
};

export default Summary;
