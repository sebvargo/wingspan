import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreGrid } from "@/components/game/score-grid";
import { DeleteGameButton } from "@/components/game/delete-game-button";
import { Trophy, FileText, Pencil } from "lucide-react";
import { getGameById, getMetrics, getLeaderboard } from "@/lib/queries";

interface GameDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { id } = await params;
  const gameId = parseInt(id, 10);
  
  if (isNaN(gameId)) {
    notFound();
  }

  const [game, metrics, leaderboard] = await Promise.all([
    getGameById(gameId),
    getMetrics(),
    getLeaderboard(),
  ]);

  if (!game) {
    notFound();
  }

  const winnerNames = game.winners
    .map((uid) => game.players.find((p) => p.uid === uid)?.display_name ?? uid)
    .join(", ");

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary bg-primary/5">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
            <Trophy className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {game.winners.length > 1 ? "Winners" : "Winner"}
            </p>
            <p className="text-2xl font-bold text-foreground">{winnerNames}</p>
            <p className="text-sm text-muted-foreground">with {game.maxTotal} points</p>
          </div>
          {game.winners.length > 1 && (
            <Badge className="ml-auto bg-accent text-accent-foreground">Tie</Badge>
          )}
        </CardContent>
      </Card>

      <ScoreGrid
        players={game.players}
        metrics={metrics}
        results={game.results}
        totals={game.totals}
        winners={game.winners}
        actions={
          <>
            <Link href={`/games/${game.id}/edit`}>
              <Button variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit Game
              </Button>
            </Link>
            <DeleteGameButton gameId={game.id} />
          </>
        }
      />

      {game.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{game.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Player Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {game.players.map((player) => {
              const playerStats = leaderboard.find((e) => e.player.uid === player.uid);
              const gameScore = game.totals[player.uid] ?? 0;
              const avgScore = playerStats?.avgScore ?? 0;
              const diff = gameScore - avgScore;

              return (
                <div
                  key={player.uid}
                  className="rounded-lg bg-secondary/60 p-4"
                >
                  <Link
                    href={`/players/${player.uid}`}
                    className="font-medium text-foreground hover:text-primary hover:underline"
                  >
                    {player.display_name}
                  </Link>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Average: {Math.round(avgScore * 10) / 10}</p>
                    <p>
                      This game: {gameScore}{" "}
                      <span
                        className={
                          diff > 0 ? "text-primary" : diff < 0 ? "text-destructive" : ""
                        }
                      >
                        ({diff > 0 ? "+" : ""}
                        {Math.round(diff * 10) / 10})
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
