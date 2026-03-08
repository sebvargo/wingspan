"use client";

import { useMemo } from "react";
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
  sebastian: "#2D6B69",
  anne: "#F26858",
  maria: "#786453",
  giedrius: "#F5A27F",
  dan: "#558F8D",
  justina: "#A69280",
};

export function MetricRadarChart({ data, players }: MetricRadarChartProps) {
  const normalizedData = useMemo(() => {
    return data.map((row) => {
      const maxForMetric = Math.max(
        ...players.map((player) => {
          const value = row[player.uid];
          return typeof value === "number" ? value : Number(value) || 0;
        }),
        0
      );

      const normalizedRow: Record<string, string | number> = {
        metric: String(row.metric),
        metricMax: maxForMetric,
      };

      for (const player of players) {
        const rawValue = row[player.uid];
        const numericRaw = typeof rawValue === "number" ? rawValue : Number(rawValue) || 0;
        normalizedRow[player.uid] = maxForMetric > 0 ? numericRaw / maxForMetric : 0;
        normalizedRow[`${player.uid}Raw`] = numericRaw;
      }

      return normalizedRow;
    });
  }, [data, players]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metric Averages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={normalizedData}>
              <PolarGrid stroke="#D7ECE8" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#786453", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 1]}
                tickFormatter={(value) => `${Math.round(Number(value) * 100)}%`}
                tick={{ fill: "#786453", fontSize: 10 }}
              />
              <Tooltip
                itemSorter={(item) => {
                  const value = typeof item.value === "number" ? item.value : Number(item.value);
                  return Number.isNaN(value) ? 0 : -value;
                }}
                formatter={(value, name, item) => {
                  const normalizedValue =
                    typeof value === "number" ? value : Number(value) || 0;
                  const rawValue = item?.payload?.[`${item.dataKey as string}Raw`];
                  const numericRaw =
                    typeof rawValue === "number" ? rawValue : Number(rawValue) || 0;

                  return [
                    `${Math.round(numericRaw * 10) / 10} (${Math.round(normalizedValue * 100)}%)`,
                    name,
                  ];
                }}
                labelFormatter={(label, payload) => {
                  const maxForMetric = payload?.[0]?.payload?.metricMax;
                  const numericMax =
                    typeof maxForMetric === "number" ? maxForMetric : Number(maxForMetric) || 0;
                  if (!numericMax) {
                    return String(label);
                  }
                  return `${String(label)} (max ${Math.round(numericMax * 10) / 10})`;
                }}
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
                  stroke={PLAYER_COLORS[player.uid] || "#2D6B69"}
                  fill={PLAYER_COLORS[player.uid] || "#2D6B69"}
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
