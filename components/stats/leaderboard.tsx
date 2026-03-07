"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/types";
import { ChevronUp, ChevronDown } from "lucide-react";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

type SortField = "winRate" | "wins" | "gamesPlayed" | "avgScore" | "bestScore";

export function Leaderboard({ entries }: LeaderboardProps) {
  const [sortField, setSortField] = useState<SortField>("winRate");
  const [sortDesc, setSortDesc] = useState(true);

  const sortedEntries = [...entries].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    return sortDesc ? bVal - aVal : aVal - bVal;
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-wing-brown hover:text-charcoal"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDesc ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
        )}
      </div>
    </th>
  );

  // Find the max value in each numeric column for highlighting
  const maxValues = {
    winRate: Math.max(...entries.map((e) => e.winRate)),
    wins: Math.max(...entries.map((e) => e.wins)),
    avgScore: Math.max(...entries.map((e) => e.avgScore)),
    bestScore: Math.max(...entries.map((e) => e.bestScore)),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pale-aqua">
                <th className="px-4 py-3 text-left text-sm font-medium text-wing-brown">Player</th>
                <SortHeader field="gamesPlayed">Games</SortHeader>
                <SortHeader field="wins">Wins</SortHeader>
                <SortHeader field="winRate">Win %</SortHeader>
                <SortHeader field="avgScore">Avg Score</SortHeader>
                <SortHeader field="bestScore">Best</SortHeader>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.map((entry) => (
                <tr key={entry.player.uid} className="border-b border-pale-aqua/50 hover:bg-pale-aqua/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/players/${entry.player.uid}`}
                      className="font-medium text-charcoal hover:text-sky-blue hover:underline"
                    >
                      {entry.player.display_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-charcoal">{entry.gamesPlayed}</td>
                  <td className={cn(
                    "px-4 py-3",
                    entry.wins === maxValues.wins && maxValues.wins > 0 && "bg-sky-blue/10 font-semibold text-sky-blue"
                  )}>
                    {entry.wins}
                  </td>
                  <td className={cn(
                    "px-4 py-3",
                    entry.winRate === maxValues.winRate && maxValues.winRate > 0 && "bg-sky-blue/10 font-semibold text-sky-blue"
                  )}>
                    {formatPercent(entry.winRate)}
                  </td>
                  <td className={cn(
                    "px-4 py-3",
                    entry.avgScore === maxValues.avgScore && maxValues.avgScore > 0 && "bg-sky-blue/10 font-semibold text-sky-blue"
                  )}>
                    {Math.round(entry.avgScore * 10) / 10}
                  </td>
                  <td className={cn(
                    "px-4 py-3",
                    entry.bestScore === maxValues.bestScore && maxValues.bestScore > 0 && "bg-sky-blue/10 font-semibold text-sky-blue"
                  )}>
                    {entry.bestScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
