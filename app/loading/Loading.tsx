"use client";

import { Loader2 } from "lucide-react";

import { Card } from "../_components/ui/card";

const Loading = ({
  message = "Carregando Dados...",
  subMessage = "Buscando relatórios...",
}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background transition-colors">
      <Card className="bg-card p-8">
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center">
            <Loader2
              className="h-24 w-24 animate-spin text-primary"
              strokeWidth={1.5}
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-card-foreground">
              {message}
            </h2>

            <p className="text-lg text-muted-foreground">{subMessage}</p>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <div className="h-4 w-4 animate-pulse rounded-full bg-primary"></div>
            <div className="h-4 w-4 animate-pulse rounded-full bg-primary delay-150"></div>
            <div className="h-4 w-4 animate-pulse rounded-full bg-primary delay-300"></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Loading;
