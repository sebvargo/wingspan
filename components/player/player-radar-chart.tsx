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
import type { Metric } from "@/lib/types";

interface PlayerRadarChartProps {
  avgByMetric: Record<string, number>;
  groupAvgByMetric: Record<string, number>;
  metrics: Metric[];
  playerName: string;
}

export function PlayerRadarChart({
  avgByMetric,
  groupAvgByMetric,
  metrics,
  playerName,
}: PlayerRadarChartProps) {
  const data = metrics.map((metric) => ({
    metric: metric.display_name,
    player: Math.round((avgByMetric[metric.uid] || 0) * 10) / 10,
    group: Math.round((groupAvgByMetric[metric.uid] || 0) * 10) / 10,
  }));

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
              <Radar
                name={playerName}
                dataKey="player"
                stroke="#4FA3D9"
                fill="#4FA3D9"
                fillOpacity={0.3}
              />
              <Radar
                name="Group Average"
                dataKey="group"
                stroke="#7A6A5C"
                fill="#7A6A5C"
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
