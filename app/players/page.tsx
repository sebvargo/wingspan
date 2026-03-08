import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Target } from "lucide-react";
import { getLeaderboard } from "@/lib/queries";
import { formatPercent } from "@/lib/utils";

export default async function PlayersPage() {
  const leaderboard = await getLeaderboard();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leaderboard.map((entry) => (
          <Link key={entry.player.uid} href={`/players/${entry.player.uid}`}>
            <Card className="h-full transition-all hover:shadow-md hover:ring-2 hover:ring-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{entry.player.display_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <p className="mt-1 text-xl font-mono font-bold tabular-nums text-foreground">
                      {entry.wins}
                    </p>
                    <p className="text-xs text-muted-foreground">wins</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Target className="h-4 w-4" />
                    </div>
                    <p className="mt-1 text-xl font-mono font-bold tabular-nums text-foreground">
                      {formatPercent(entry.winRate)}
                    </p>
                    <p className="text-xs text-muted-foreground">win rate</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <p className="mt-1 text-xl font-mono font-bold tabular-nums text-foreground">
                      {Math.round(entry.avgScore)}
                    </p>
                    <p className="text-xs text-muted-foreground">avg score</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">
                    {entry.gamesPlayed} games played
                  </span>
                  <span className="text-sm font-medium text-primary">
                    Best: {entry.bestScore}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
