import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Game, Player } from "@/lib/types";

interface RecentGamesProps {
  games: Array<
    Game & {
      players: Player[];
      winners: string[];
      winnerNames: string[];
      maxTotal: number;
    }
  >;
}

export function RecentGames({ games }: RecentGamesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Games</CardTitle>
        <Link
          href="/games"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {games.slice(0, 5).map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="flex items-center justify-between rounded-lg bg-secondary/60 p-3 transition-colors hover:bg-secondary"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {game.id}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Game {game.id}</span>
                  <span className="text-sm text-muted-foreground">{formatDate(game.date)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Trophy className="h-3 w-3 text-accent" />
                  <span>{game.winnerNames.join(", ")}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">{game.players.length} players</Badge>
              <span className="text-lg font-bold text-primary">{game.maxTotal}</span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
