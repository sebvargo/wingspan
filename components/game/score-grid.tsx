import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Player, Metric, Result } from "@/lib/types";
import type { ReactNode } from "react";

interface ScoreGridProps {
  players: Player[];
  metrics: Metric[];
  results: Result[];
  totals: Record<string, number>;
  winners: string[];
  actions?: ReactNode;
}

export function ScoreGrid({ players, metrics, results, totals, winners, actions }: ScoreGridProps) {
  // Get score for a specific player and metric
  const getScore = (playerUid: string, metricUid: string): number | null => {
    const result = results.find(
      (r) => r.player_uid === playerUid && r.metric_uid === metricUid
    );
    return result?.score ?? null;
  };

  // Find the highest score for each metric
  const getMaxScoreForMetric = (metricUid: string): number => {
    const scores = players
      .map((p) => getScore(p.uid, metricUid))
      .filter((s): s is number => s !== null);
    return Math.max(...scores, 0);
  };

  const inputMetrics = metrics.filter((m) => m.type === "input");
  const awardMetrics = metrics.filter((m) => m.type === "award");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Score Breakdown</CardTitle>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Category
                </th>
                {players.map((player) => (
                  <th
                    key={player.uid}
                    className={cn(
                      "px-4 py-3 text-center text-sm font-medium",
                      winners.includes(player.uid)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground"
                    )}
                  >
                    {player.display_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inputMetrics.map((metric) => {
                const maxScore = getMaxScoreForMetric(metric.uid);
                return (
                  <tr key={metric.uid} className="border-b border-border/60">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {metric.display_name}
                    </td>
                    {players.map((player) => {
                      const score = getScore(player.uid, metric.uid);
                      const isMax = score !== null && score === maxScore && score > 0;
                      return (
                        <td
                          key={player.uid}
                          className={cn(
                            "px-4 py-3 text-center font-mono tabular-nums",
                            winners.includes(player.uid) && "bg-primary/5",
                            isMax && "font-bold"
                          )}
                        >
                          {isMax ? (
                            <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-primary px-2 py-0.5 text-primary-foreground shadow-sm">
                              {score}
                            </span>
                          ) : (
                            (score ?? "—")
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr className="border-t-2 border-foreground bg-secondary/40">
                <td className="px-4 py-3 text-sm font-bold text-foreground">Total</td>
                {players.map((player) => (
                  <td
                    key={player.uid}
                    className={cn(
                      "px-4 py-3 text-center text-lg font-mono font-bold tabular-nums",
                      winners.includes(player.uid)
                        ? "bg-primary/20 text-primary"
                        : "text-foreground"
                    )}
                  >
                    {totals[player.uid] ?? 0}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {awardMetrics.length > 0 && (
          <div className="mt-6 border-t border-border pt-4">
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">Awards</h4>
            {awardMetrics.map((metric) => {
              const awardedPlayer = players.find((p) => {
                const score = getScore(p.uid, metric.uid);
                return score !== null && score > 0;
              });
              return (
                <div key={metric.uid} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {metric.display_name}:
                  </span>
                  <span className="text-sm text-primary">
                    {awardedPlayer?.display_name ?? "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
