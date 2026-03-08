"use client";

import { useState, type ReactNode } from "react";
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

interface SortHeaderProps {
  field: SortField;
  children: ReactNode;
  sortField: SortField;
  sortDesc: boolean;
  onSort: (field: SortField) => void;
}

function SortHeader({ field, children, sortField, sortDesc, onSort }: SortHeaderProps) {
  return (
    <th
      className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:text-foreground"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field &&
          (sortDesc ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />)}
      </div>
    </th>
  );
}

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
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Player</th>
                <SortHeader field="gamesPlayed" sortField={sortField} sortDesc={sortDesc} onSort={handleSort}>Games</SortHeader>
                <SortHeader field="wins" sortField={sortField} sortDesc={sortDesc} onSort={handleSort}>Wins</SortHeader>
                <SortHeader field="winRate" sortField={sortField} sortDesc={sortDesc} onSort={handleSort}>Win %</SortHeader>
                <SortHeader field="avgScore" sortField={sortField} sortDesc={sortDesc} onSort={handleSort}>Avg Score</SortHeader>
                <SortHeader field="bestScore" sortField={sortField} sortDesc={sortDesc} onSort={handleSort}>Best</SortHeader>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.map((entry) => (
                <tr key={entry.player.uid} className="border-b border-border/60 hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/players/${entry.player.uid}`}
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {entry.player.display_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-foreground">{entry.gamesPlayed}</td>
                  <td className={cn(
                    "px-4 py-3 font-mono tabular-nums",
                    entry.wins === maxValues.wins && maxValues.wins > 0 && "bg-primary/10 font-semibold text-primary"
                  )}>
                    {entry.wins}
                  </td>
                  <td className={cn(
                    "px-4 py-3 font-mono tabular-nums",
                    entry.winRate === maxValues.winRate && maxValues.winRate > 0 && "bg-primary/10 font-semibold text-primary"
                  )}>
                    {formatPercent(entry.winRate)}
                  </td>
                  <td className={cn(
                    "px-4 py-3 font-mono tabular-nums",
                    entry.avgScore === maxValues.avgScore && maxValues.avgScore > 0 && "bg-primary/10 font-semibold text-primary"
                  )}>
                    {Math.round(entry.avgScore * 10) / 10}
                  </td>
                  <td className={cn(
                    "px-4 py-3 font-mono tabular-nums",
                    entry.bestScore === maxValues.bestScore && maxValues.bestScore > 0 && "bg-primary/10 font-semibold text-primary"
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
