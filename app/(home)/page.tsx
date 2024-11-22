"use client";

import React from "react";
import AuthGuard from "../_components/AuthGuard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <AuthGuard>
      <div className="flex items-center justify-center min-h-screen bg-muted-foreground-foreground">
        <Card>
          <CardHeader>
            <CardTitle>
              Bem-vindo ao Dashboard, {session?.user?.name}!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm font-bold">
              Bem-vindo ao sistema de gerenciamento de estoque.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
