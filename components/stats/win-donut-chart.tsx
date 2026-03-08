"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WinDonutChartProps {
  data: Array<{ name: string; uid: string; wins: number }>;
}

const PLAYER_COLORS: Record<string, string> = {
  sebastian: "#2D6B69",
  anne: "#F26858",
  maria: "#786453",
  giedrius: "#F5A27F",
  dan: "#558F8D",
  justina: "#A69280",
};

export function WinDonutChart({ data }: WinDonutChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Win Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="wins"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.uid}
                    fill={PLAYER_COLORS[entry.uid] || "#2D6B69"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D7ECE8",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value} wins`, "Wins"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
