"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../_components/ui/card";
import { Button } from "../_components/ui/button";
import { Input } from "../_components/ui/input";
import { Label } from "../_components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "../_components/ui/alert";
import React from "react";



export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [status, setStatus] = useState({
    message: "",
    type: "",
    details: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: "", type: "", details: "" });

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar empresa");
      }

      setStatus({
        message: "Empresa cadastrada com sucesso!",
        type: "success",
        details: `Nome: ${data.company.name}\nEmail: ${data.company.email}\nID: ${data.company.id}`,
      });

      // Limpa o formulário após sucesso
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setStatus({
        message: "Erro ao cadastrar empresa",
        type: "error",
        details: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastro de Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Digite o nome da empresa"
                className="w-full"
                minLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="empresa@exemplo.com"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
             <div className="relative">
             <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Digite a senha"
                minLength={6}
                className="w-full"
              />
              <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
       
             </div>
            </div>

            {(status.message || status.details) && (
              <Alert
                variant={status.type === "error" ? "destructive" : "default"}
              >
                <AlertTitle>
                  {status.type === "error" ? "Erro" : "Sucesso"}
                </AlertTitle>
                <AlertDescription className="whitespace-pre-line">
                  {status.message}
                  {status.details && "\n" + status.details}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Empresa"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
