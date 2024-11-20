import { LogInIcon } from "lucide-react";
import { Button } from "../_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Input } from "../_components/ui/input";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted-foreground-foreground p-1">
      <Card className="w-full  md:w-[50%]">
        <CardHeader>
          <CardTitle>Faça Login</CardTitle>
          <CardDescription>
            Faça login para utilizar a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input type="email" placeholder="Digite seu E-mail" />
          <Input type="password" placeholder="Digite sua Senha" />
        </CardContent>
        <CardFooter className="justify-end">
          <Button>
            <LogInIcon size={16} />
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
