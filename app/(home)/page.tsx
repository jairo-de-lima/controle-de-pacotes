import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted-foreground-foreground">
      <Card>
        <CardHeader>
          <CardTitle>Pagina inicial</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-3xl font-bold">
            Bem vindo ao sistema de gerenciamento de estoque
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
