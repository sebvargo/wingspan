import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users } from "lucide-react";
import { getGamesWithWinners } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export default async function GamesPage() {
  const games = await getGamesWithWinners();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Players</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Winner</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Score</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr
                    key={game.id}
                    className="border-b border-border/60 transition-colors hover:bg-secondary/40"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/games/${game.id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {game.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {formatDate(game.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {game.players.map((p) => p.display_name).join(", ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-accent" />
                        <span className="font-medium text-foreground">
                          {game.winnerNames.join(", ")}
                          {game.winners.length > 1 && (
                            <Badge variant="outline" className="ml-2">
                              tie
                            </Badge>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-lg font-bold text-primary">{game.maxTotal}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
