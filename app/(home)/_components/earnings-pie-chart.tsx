import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface EarningsPieChartProps {
  courierEarnings:
    | Array<{
        name: string;
        value: number;
      }>
    | undefined;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

import { TooltipProps } from "recharts";

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
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
