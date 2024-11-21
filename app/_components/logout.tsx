"use client"; // Certificando-se de que o componente é tratado como cliente

import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";
import { signOut } from "next-auth/react"; // Importando a função de logout
import { usePathname } from "next/navigation";

const LogoutButton = () => {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); // Redireciona para a página inicial após o logout
  };

  if (isLoginPage) return null;

  return (
    <div className="flex items-center justify-end space-x-2 p-2">
      <Button variant="outline" onClick={handleLogout}>
        <LogOutIcon size={16} />
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
