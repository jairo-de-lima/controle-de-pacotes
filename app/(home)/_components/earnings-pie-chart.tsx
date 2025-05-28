import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TooltipProps } from "recharts";

interface EarningsPieChartProps {
  courierEarnings:
    | Array<{
        name: string;
        value: number;
      }>
    | undefined;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <Card className="flex flex-col items-center justify-center bg-transparent p-2">
        <CardTitle className="text-sm font-extrabold uppercase">
          {payload[0].payload.name}
        </CardTitle>
        <CardContent className="text-sm font-bold">
          Ganhos: R$ {Number(payload[0].value).toFixed(2)}
        </CardContent>
      </Card>
    );
  }
  return null;
};

export default function EarningsPieChart({
  courierEarnings,
}: EarningsPieChartProps) {
  if (!courierEarnings || courierEarnings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ganhos por Entregador</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">
            Sem dados de ganhos disponíveis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ganhos por Entregador</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={courierEarnings}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {courierEarnings.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legenda com scroll abaixo do gráfico */}
        <div className="max-h-[80px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <ScrollArea className="scroll-area-custom">
            <div className="space-y-1">
              {courierEarnings.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
