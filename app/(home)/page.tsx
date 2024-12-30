"use client";

import React from "react";
import AuthGuard from "../_components/AuthGuard";
import Dashboard from "@/app/(home)/_components/dashbord";

export default function Home() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <Dashboard />
      </div>
    </AuthGuard>
  );
}
