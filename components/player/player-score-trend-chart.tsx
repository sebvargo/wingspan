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
    winningScore: number;
    isWinner: boolean;
    winnerNames?: string[];
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
      winningScore: game.winningScore,
      gapToWin: Math.max(game.winningScore - game.score, 0),
      isWinner: game.isWinner,
      winnerNames: game.winnerNames ?? [],
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
                tick={{ fill: "#786453", fontSize: 12 }}
                tickFormatter={(value) => `#${value}`}
              />
              <YAxis
                tick={{ fill: "#786453", fontSize: 12 }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D7ECE8",
                  borderRadius: "8px",
                }}
                labelFormatter={(value, payload) => {
                  const winners = payload?.[0]?.payload?.winnerNames as string[] | undefined;
                  const winnerLabel = winners && winners.length > 0 ? winners.join(", ") : "—";
                  return `Game ${value} | Winner: ${winnerLabel}`;
                }}
                formatter={(value, name, item) => {
                  const numericValue = Number(value);
                  if (name === "Winning Score") {
                    return [numericValue, "Winning Score"];
                  }

                  const gapToWin = Number(item?.payload?.gapToWin || 0);
                  const label = gapToWin > 0 ? `${playerName} (${gapToWin} behind)` : `${playerName} (won)`;
                  return [numericValue, label];
                }}
              />
              <ReferenceLine
                y={avgScore}
                stroke="#786453"
                strokeDasharray="5 5"
                label={{
                  value: `Avg: ${Math.round(avgScore)}`,
                  position: "right",
                  fill: "#786453",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                name={playerName}
                stroke="#2D6B69"
                strokeWidth={2}
                dot={({ cx, cy, payload }) => (
                  <circle
                    key={payload.game}
                    cx={cx}
                    cy={cy}
                    r={payload.isWinner ? 6 : 4}
                    fill={payload.isWinner ? "#F5A27F" : "#2D6B69"}
                    stroke={payload.isWinner ? "#F26858" : "none"}
                    strokeWidth={2}
                  />
                )}
              />
              <Line
                type="monotone"
                dataKey="winningScore"
                name="Winning Score"
                stroke="#F26858"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          <span className="text-primary">Teal line</span> is {playerName};{" "}
          <span className="text-accent">dashed coral line</span> is game-winning score;{" "}
          <span className="text-accent">orange dots</span> indicate wins.
        </p>
      </CardContent>
    </Card>
  );
}
