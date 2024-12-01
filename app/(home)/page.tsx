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
        <Card className="flex w-[90%] flex-col items-center">
          <CardHeader>
            <CardTitle className="text-base">
              Bem-vindo ao Dashboard,{" "}
              <span className="uppercase">{session?.user?.name} </span>!
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
