"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogInIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Input } from "../_components/ui/input";
import { Button } from "../_components/ui/button";
import React from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError(""); // Limpa o erro ao tentar logar novamente

    const result = await signIn("credentials", {
      redirect: false, // Evita redirecionamento automático
      email,
      password,
    });

    if (result?.error) {
      setError("Credenciais inválidas! Verifique seu e-mail e senha.");
    } else {
      router.push("/"); // Redireciona após login bem-sucedido
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted-foreground-foreground p-1">
      <Card className="w-full md:w-[50%]">
        <CardHeader>
          <CardTitle>Faça Login</CardTitle>
          <CardDescription>
            Faça login para utilizar a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            type="email"
            placeholder="Digite seu E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Digite sua Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleLogin}>
            <LogInIcon size={16} />
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
