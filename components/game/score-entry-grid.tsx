"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { Player, Metric } from "@/lib/types";

interface ScoreEntryGridProps {
  players: Player[];
  metrics: Metric[];
  initialScores?: Record<string, Record<string, number>>;
  initialAwards?: Record<string, string>;
  onScoresChange: (scores: Record<string, Record<string, number>>) => void;
  onAwardsChange: (awards: Record<string, string>) => void;
}

export function ScoreEntryGrid({
  players,
  metrics,
  initialScores,
  initialAwards,
  onScoresChange,
  onAwardsChange,
}: ScoreEntryGridProps) {
  const [scoreState, setScoreState] = useState<Record<string, Record<string, number>>>(
    () => initialScores ?? {}
  );
  const [awardState, setAwardState] = useState<Record<string, string>>(
    () => initialAwards ?? {}
  );

  const inputMetrics = useMemo(
    () => metrics.filter((m) => m.type === "input"),
    [metrics]
  );
  const awardMetrics = useMemo(
    () => metrics.filter((m) => m.type === "award"),
    [metrics]
  );

  const scores = useMemo(() => {
    const nextScores: Record<string, Record<string, number>> = {};

    for (const player of players) {
      nextScores[player.uid] = {};
      for (const metric of inputMetrics) {
        nextScores[player.uid][metric.uid] = scoreState[player.uid]?.[metric.uid] ?? 0;
      }
    }

    return nextScores;
  }, [players, inputMetrics, scoreState]);

  const awards = useMemo(() => {
    const nextAwards: Record<string, string> = {};
    const validPlayerUids = new Set(players.map((player) => player.uid));
    const validAwardMetricUids = new Set(awardMetrics.map((metric) => metric.uid));

    for (const [metricUid, playerUid] of Object.entries(awardState)) {
      if (validAwardMetricUids.has(metricUid) && validPlayerUids.has(playerUid)) {
        nextAwards[metricUid] = playerUid;
      }
    }

    return nextAwards;
  }, [players, awardMetrics, awardState]);

  // Notify parent of changes
  useEffect(() => {
    onScoresChange(scores);
  }, [scores, onScoresChange]);

  useEffect(() => {
    onAwardsChange(awards);
  }, [awards, onAwardsChange]);

  const handleScoreChange = (playerUid: string, metricUid: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;

    setScoreState((prev) => ({
      ...prev,
      [playerUid]: {
        ...prev[playerUid],
        [metricUid]: numValue,
      },
    }));
  };

  const handleAwardChange = (metricUid: string, playerUid: string) => {
    setAwardState((prev) => ({
      ...prev,
      [metricUid]: prev[metricUid] === playerUid ? "" : playerUid,
    }));
  };

  // Calculate totals
  const getTotalForPlayer = (playerUid: string): number => {
    if (!scores[playerUid]) return 0;
    return Object.values(scores[playerUid]).reduce((sum, val) => sum + val, 0);
  };

  // Find player with highest total
  const maxTotal = Math.max(...players.map((p) => getTotalForPlayer(p.uid)));

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-pale-aqua">
            <th className="px-4 py-3 text-left text-sm font-medium text-wing-brown">
              Category
            </th>
            {players.map((player) => {
              const total = getTotalForPlayer(player.uid);
              const isLeading = total === maxTotal && total > 0;
              return (
                <th
                  key={player.uid}
                  className={cn(
                    "px-4 py-3 text-center text-sm font-medium",
                    isLeading ? "bg-sky-blue/10 text-sky-blue" : "text-charcoal"
                  )}
                >
                  {player.display_name}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {inputMetrics.map((metric) => (
            <tr key={metric.uid} className="border-b border-pale-aqua/50">
              <td className="px-4 py-3 text-sm font-medium text-charcoal">
                {metric.display_name}
              </td>
              {players.map((player) => {
                const total = getTotalForPlayer(player.uid);
                const isLeading = total === maxTotal && total > 0;
                return (
                  <td
                    key={player.uid}
                    className={cn("px-2 py-2", isLeading && "bg-sky-blue/5")}
                  >
                    <Input
                      type="number"
                      min={0}
                      value={scores[player.uid]?.[metric.uid] ?? 0}
                      onChange={(e) =>
                        handleScoreChange(player.uid, metric.uid, e.target.value)
                      }
                      className="h-9 w-20 text-center"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="border-t-2 border-charcoal bg-pale-aqua/30">
            <td className="px-4 py-3 text-sm font-bold text-charcoal">Total</td>
            {players.map((player) => {
              const total = getTotalForPlayer(player.uid);
              const isLeading = total === maxTotal && total > 0;
              return (
                <td
                  key={player.uid}
                  className={cn(
                    "px-4 py-3 text-center text-lg font-bold",
                    isLeading ? "bg-sky-blue/20 text-sky-blue" : "text-charcoal"
                  )}
                >
                  {total}
                </td>
              );
            })}
          </tr>
          {awardMetrics.map((metric) => (
            <tr key={metric.uid} className="border-b border-pale-aqua/50">
              <td className="px-4 py-3 text-sm font-medium text-charcoal">
                {metric.display_name}
              </td>
              {players.map((player) => (
                <td key={player.uid} className="px-2 py-2 text-center">
                  <input
                    type="radio"
                    name={`award-${metric.uid}`}
                    checked={awards[metric.uid] === player.uid}
                    onChange={() => handleAwardChange(metric.uid, player.uid)}
                    className="h-4 w-4 cursor-pointer accent-sky-blue"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
