"use client"; // Torna o layout um Client Component

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import ThemeToggle from "./_components/toggletheme";
import Footer from "./_components/footer";
import LogoutButton from "./_components/logout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Obtém a rota atual
  const excludedRoutes = ["/login"]; // Rotas onde o LogoutButton não será exibido

  const isExcluded = excludedRoutes.includes(pathname);

  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          <div className="fixed w-full">
            <ThemeToggle />
            {/* Exibe LogoutButton apenas fora das rotas excluídas */}
            {!isExcluded && <LogoutButton />}
          </div>
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
