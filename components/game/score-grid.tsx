import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Player, Metric, Result } from "@/lib/types";

interface ScoreGridProps {
  players: Player[];
  metrics: Metric[];
  results: Result[];
  totals: Record<string, number>;
  winners: string[];
}

export function ScoreGrid({ players, metrics, results, totals, winners }: ScoreGridProps) {
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
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pale-aqua">
                <th className="px-4 py-3 text-left text-sm font-medium text-wing-brown">
                  Category
                </th>
                {players.map((player) => (
                  <th
                    key={player.uid}
                    className={cn(
                      "px-4 py-3 text-center text-sm font-medium",
                      winners.includes(player.uid)
                        ? "bg-sky-blue/10 text-sky-blue"
                        : "text-charcoal"
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
                  <tr key={metric.uid} className="border-b border-pale-aqua/50">
                    <td className="px-4 py-3 text-sm font-medium text-charcoal">
                      {metric.display_name}
                    </td>
                    {players.map((player) => {
                      const score = getScore(player.uid, metric.uid);
                      const isMax = score !== null && score === maxScore && score > 0;
                      return (
                        <td
                          key={player.uid}
                          className={cn(
                            "px-4 py-3 text-center",
                            winners.includes(player.uid) && "bg-sky-blue/5",
                            isMax && "font-bold text-sky-blue"
                          )}
                        >
                          {score ?? "—"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr className="border-t-2 border-charcoal bg-pale-aqua/30">
                <td className="px-4 py-3 text-sm font-bold text-charcoal">Total</td>
                {players.map((player) => (
                  <td
                    key={player.uid}
                    className={cn(
                      "px-4 py-3 text-center text-lg font-bold",
                      winners.includes(player.uid)
                        ? "bg-sky-blue/20 text-sky-blue"
                        : "text-charcoal"
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
          <div className="mt-6 border-t border-pale-aqua pt-4">
            <h4 className="mb-3 text-sm font-medium text-wing-brown">Awards</h4>
            {awardMetrics.map((metric) => {
              const awardedPlayer = players.find((p) => {
                const score = getScore(p.uid, metric.uid);
                return score !== null && score > 0;
              });
              return (
                <div key={metric.uid} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-charcoal">
                    {metric.display_name}:
                  </span>
                  <span className="text-sm text-sky-blue">
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
