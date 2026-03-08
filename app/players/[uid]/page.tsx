import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  TrendingUp,
  Target,
  Calendar,
  Medal,
  Zap,
} from "lucide-react";
import {
  getPlayerStats,
  getPlayerGameHistory,
  getInputMetrics,
  getLeaderboard,
} from "@/lib/queries";
import { formatPercent, formatDate, ordinal } from "@/lib/utils";
import { PlayerScoreTrendChart } from "@/components/player/player-score-trend-chart";
import { PlayerRadarChart } from "@/components/player/player-radar-chart";

interface PlayerProfilePageProps {
  params: Promise<{ uid: string }>;
}

export default async function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const { uid } = await params;

  const [playerStats, gameHistory, metrics, leaderboard] = await Promise.all([
    getPlayerStats(uid),
    getPlayerGameHistory(uid),
    getInputMetrics(),
    getLeaderboard(),
  ]);

  if (!playerStats) {
    notFound();
  }

  // Calculate group averages for comparison
  const groupAvgByMetric: Record<string, number> = {};
  const metricMaxByMetric: Record<string, number> = {};
  for (const metric of metrics) {
    const allAvgs = leaderboard.map((e) => e.avgByMetric[metric.uid] || 0);
    metricMaxByMetric[metric.uid] = Math.max(...allAvgs, 0);
    groupAvgByMetric[metric.uid] =
      allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length;
  }

  const statCards = [
    {
      label: "Games Played",
      value: playerStats.gamesPlayed,
      icon: Calendar,
    },
    {
      label: "Wins",
      value: playerStats.wins,
      icon: Trophy,
    },
    {
      label: "Win Rate",
      value: formatPercent(playerStats.winRate),
      icon: Target,
    },
    {
      label: "Avg Score",
      value: Math.round(playerStats.avgScore * 10) / 10,
      icon: TrendingUp,
    },
    {
      label: "Best Score",
      value: playerStats.bestScore,
      icon: Zap,
    },
    {
      label: "Worst Score",
      value: playerStats.worstScore,
      icon: Medal,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="flex flex-col items-center p-4 text-center">
                <div className="rounded-full bg-secondary p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-2 text-2xl font-mono font-bold tabular-nums text-foreground">
                  {card.value}
                </p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PlayerScoreTrendChart
          gameHistory={gameHistory}
          avgScore={playerStats.avgScore}
          playerName={playerStats.player.display_name}
        />
        <PlayerRadarChart
          avgByMetric={playerStats.avgByMetric}
          groupAvgByMetric={groupAvgByMetric}
          metricMaxByMetric={metricMaxByMetric}
          metrics={metrics}
          playerName={playerStats.player.display_name}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Metric Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.map((metric) => {
                const playerAvg = playerStats.avgByMetric[metric.uid] || 0;
                const groupAvg = groupAvgByMetric[metric.uid];
                const diff = playerAvg - groupAvg;
                const isAbove = diff > 0;

                return (
                  <div
                    key={metric.uid}
                    className="flex items-center justify-between rounded-lg bg-secondary/60 p-3"
                  >
                    <span className="font-medium text-foreground">
                      {metric.display_name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-foreground">
                        {Math.round(playerAvg * 10) / 10}
                      </span>
                      <span
                        className={`text-sm ${
                          isAbove ? "text-primary" : "text-destructive"
                        }`}
                      >
                        {isAbove ? "+" : ""}
                        {Math.round(diff * 10) / 10} vs avg
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left text-sm font-medium text-muted-foreground">
                      Game
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="px-3 py-2 text-right text-sm font-medium text-muted-foreground">
                      Score
                    </th>
                    <th className="px-3 py-2 text-right text-sm font-medium text-muted-foreground">
                      Rank
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistory.map((game) => (
                    <tr
                      key={game.gameId}
                      className="border-b border-border/60 hover:bg-secondary/40"
                    >
                      <td className="px-3 py-2">
                        <Link
                          href={`/games/${game.gameId}`}
                          className="font-medium text-primary hover:underline"
                        >
                          #{game.gameId}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-foreground">
                        {formatDate(game.date)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-foreground">
                        {game.score}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {game.isWinner ? (
                          <Badge className="bg-accent text-accent-foreground">
                            <Trophy className="mr-1 h-3 w-3" />
                            1st
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">
                            {ordinal(game.rank)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
