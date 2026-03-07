"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlayerScoreTrendChartProps {
  gameHistory: Array<{
    gameId: number;
    score: number;
    isWinner: boolean;
  }>;
  avgScore: number;
  playerName: string;
}

export function PlayerScoreTrendChart({
  gameHistory,
  avgScore,
  playerName,
}: PlayerScoreTrendChartProps) {
  const data = gameHistory
    .slice()
    .reverse()
    .map((game) => ({
      game: game.gameId,
      score: game.score,
      isWinner: game.isWinner,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#D7ECE8" />
              <XAxis
                dataKey="game"
                tick={{ fill: "#7A6A5C", fontSize: 12 }}
                tickFormatter={(value) => `#${value}`}
              />
              <YAxis
                tick={{ fill: "#7A6A5C", fontSize: 12 }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D7ECE8",
                  borderRadius: "8px",
                }}
                labelFormatter={(value) => `Game ${value}`}
                formatter={(value) => [value, playerName]}
              />
              <ReferenceLine
                y={avgScore}
                stroke="#7A6A5C"
                strokeDasharray="5 5"
                label={{
                  value: `Avg: ${Math.round(avgScore)}`,
                  position: "right",
                  fill: "#7A6A5C",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                name={playerName}
                stroke="#4FA3D9"
                strokeWidth={2}
                dot={({ cx, cy, payload }) => (
                  <circle
                    key={payload.game}
                    cx={cx}
                    cy={cy}
                    r={payload.isWinner ? 6 : 4}
                    fill={payload.isWinner ? "#F5A27F" : "#4FA3D9"}
                    stroke={payload.isWinner ? "#F26A5A" : "none"}
                    strokeWidth={2}
                  />
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-sm text-wing-brown">
          Orange dots indicate wins
        </p>
      </CardContent>
    </Card>
  );
}
