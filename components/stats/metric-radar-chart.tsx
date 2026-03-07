"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Player } from "@/lib/types";

interface MetricRadarChartProps {
  data: Array<Record<string, string | number>>;
  players: Player[];
}

const PLAYER_COLORS: Record<string, string> = {
  anne: "#4FA3D9",
  dan: "#79C6C4",
  giedrius: "#F5A27F",
  justina: "#F26A5A",
  maria: "#7A6A5C",
  sebastian: "#2F2F2F",
};

export function MetricRadarChart({ data, players }: MetricRadarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metric Averages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="#D7ECE8" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#7A6A5C", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, "auto"]}
                tick={{ fill: "#7A6A5C", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D7ECE8",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              {players.map((player) => (
                <Radar
                  key={player.uid}
                  name={player.display_name}
                  dataKey={player.uid}
                  stroke={PLAYER_COLORS[player.uid] || "#4FA3D9"}
                  fill={PLAYER_COLORS[player.uid] || "#4FA3D9"}
                  fillOpacity={0.1}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
