"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Player } from "@/lib/types";

interface ScoreTrendChartProps {
  data: Array<Record<string, number | null>>;
  players: Player[];
}

const PLAYER_COLORS: Record<string, string> = {
  sebastian: "#2D6B69",
  anne: "#F26858",
  maria: "#786453",
  giedrius: "#F5A27F",
  dan: "#558F8D",
  justina: "#A69280",
};

export function ScoreTrendChart({ data, players }: ScoreTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D7ECE8" />
              <XAxis
                dataKey="game"
                tick={{ fill: "#786453", fontSize: 12 }}
                tickFormatter={(value) => `#${value}`}
              />
              <YAxis
                tick={{ fill: "#786453", fontSize: 12 }}
                domain={[40, "auto"]}
              />
              <Tooltip
                itemSorter={(item) => {
                  const value = typeof item.value === "number" ? item.value : Number(item.value);
                  return Number.isNaN(value) ? 0 : -value;
                }}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D7ECE8",
                  borderRadius: "8px",
                }}
                labelFormatter={(value) => `Game ${value}`}
              />
              <Legend />
              {players.map((player) => (
                <Line
                  key={player.uid}
                  type="monotone"
                  dataKey={player.uid}
                  name={player.display_name}
                  stroke={PLAYER_COLORS[player.uid] || "#2D6B69"}
                  strokeWidth={2}
                  dot={{ fill: PLAYER_COLORS[player.uid] || "#2D6B69", strokeWidth: 0, r: 3 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
