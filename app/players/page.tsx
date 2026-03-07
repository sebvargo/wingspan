import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Target } from "lucide-react";
import { getLeaderboard } from "@/lib/queries";
import { formatPercent } from "@/lib/utils";

export default async function PlayersPage() {
  const leaderboard = await getLeaderboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-charcoal">Players</h1>
        <p className="mt-1 text-wing-brown">
          View profiles and statistics for all {leaderboard.length} players
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leaderboard.map((entry) => (
          <Link key={entry.player.uid} href={`/players/${entry.player.uid}`}>
            <Card className="h-full transition-all hover:shadow-md hover:ring-2 hover:ring-sky-blue/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{entry.player.display_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-wing-brown">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <p className="mt-1 text-xl font-bold text-charcoal">{entry.wins}</p>
                    <p className="text-xs text-wing-brown">wins</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-wing-brown">
                      <Target className="h-4 w-4" />
                    </div>
                    <p className="mt-1 text-xl font-bold text-charcoal">
                      {formatPercent(entry.winRate)}
                    </p>
                    <p className="text-xs text-wing-brown">win rate</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-wing-brown">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <p className="mt-1 text-xl font-bold text-charcoal">
                      {Math.round(entry.avgScore)}
                    </p>
                    <p className="text-xs text-wing-brown">avg score</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-pale-aqua pt-3">
                  <span className="text-sm text-wing-brown">
                    {entry.gamesPlayed} games played
                  </span>
                  <span className="text-sm font-medium text-sky-blue">
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
