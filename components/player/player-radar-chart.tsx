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
import type { Metric } from "@/lib/types";

interface PlayerRadarChartProps {
  avgByMetric: Record<string, number>;
  groupAvgByMetric: Record<string, number>;
  metricMaxByMetric: Record<string, number>;
  metrics: Metric[];
  playerName: string;
}

export function PlayerRadarChart({
  avgByMetric,
  groupAvgByMetric,
  metricMaxByMetric,
  metrics,
  playerName,
}: PlayerRadarChartProps) {
  const data = useMemo(() => {
    return metrics.map((metric) => {
      const playerRaw = Math.round((avgByMetric[metric.uid] || 0) * 10) / 10;
      const groupRaw = Math.round((groupAvgByMetric[metric.uid] || 0) * 10) / 10;
      const metricMax = metricMaxByMetric[metric.uid] || 0;

      return {
        metric: metric.display_name,
        player: metricMax > 0 ? playerRaw / metricMax : 0,
        group: metricMax > 0 ? groupRaw / metricMax : 0,
        playerRaw,
        groupRaw,
        metricMax,
      };
    });
  }, [avgByMetric, groupAvgByMetric, metricMaxByMetric, metrics]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metric Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
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
                  const rawField = item.dataKey === "player" ? "playerRaw" : "groupRaw";
                  const rawValue = item?.payload?.[rawField];
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
              <Radar
                name={playerName}
                dataKey="player"
                stroke="#2D6B69"
                fill="#2D6B69"
                fillOpacity={0.3}
              />
              <Radar
                name="Group Average"
                dataKey="group"
                stroke="#786453"
                fill="#786453"
                fillOpacity={0.1}
                strokeDasharray="5 5"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
