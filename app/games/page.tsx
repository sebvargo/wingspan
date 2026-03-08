import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Plus, Users } from "lucide-react";
import { getGamesWithWinners } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export default async function GamesPage() {
  const games = await getGamesWithWinners();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Games</h1>
          <p className="mt-1 text-wing-brown">
            Browse all {games.length} games played
          </p>
        </div>
        <Link href="/games/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Game
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-pale-aqua">
                  <th className="px-4 py-3 text-left text-sm font-medium text-wing-brown">#</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-wing-brown">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-wing-brown">Players</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-wing-brown">Winner</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-wing-brown">Score</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr
                    key={game.id}
                    className="border-b border-pale-aqua/50 transition-colors hover:bg-pale-aqua/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/games/${game.id}`}
                        className="font-semibold text-sky-blue hover:underline"
                      >
                        {game.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-charcoal">
                      {formatDate(game.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-wing-brown" />
                        <span className="text-charcoal">
                          {game.players.map((p) => p.display_name).join(", ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-peach" />
                        <span className="font-medium text-charcoal">
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
                      <span className="text-lg font-bold text-sky-blue">{game.maxTotal}</span>
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
