"use client"; // Torna o layout um Client Component

import { SessionProvider } from "next-auth/react";

import "./globals.css";

import Footer from "./_components/footer";

import { ThemeProvider } from "./providers/theme-provider";
import Navbar from "./navbar/navbar";
import { Toaster } from "./_components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <div className="fixed w-full">
              <Navbar />
            </div>
            {children}
            <Toaster />
            <Footer />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
