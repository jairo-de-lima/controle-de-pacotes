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
import Dashboard from "@/app/(home)/_components/dashbord";

export default function Home() {
  const { data: session } = useSession();

  return (
    <AuthGuard>
      <div className="bg-muted-foreground-foreground flex min-h-screen flex-col items-center justify-center gap-2">
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
        <Dashboard />
      </div>
    </AuthGuard>
  );
}
