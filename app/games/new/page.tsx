import { NewGameForm } from "@/components/game/new-game-form";
import { getPlayers, getMetrics, getLeaderboard } from "@/lib/queries";

export default async function NewGamePage() {
  const [players, metrics, leaderboard] = await Promise.all([
    getPlayers(),
    getMetrics(),
    getLeaderboard(),
  ]);

  // Build player stats map
  const playerStats: Record<string, { avgScore: number; gamesPlayed: number; wins: number }> = {};
  for (const entry of leaderboard) {
    playerStats[entry.player.uid] = {
      avgScore: entry.avgScore,
      gamesPlayed: entry.gamesPlayed,
      wins: entry.wins,
    };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-charcoal">New Game</h1>
        <p className="mt-1 text-wing-brown">Record the scores from your latest game</p>
      </div>

      <NewGameForm allPlayers={players} metrics={metrics} playerStats={playerStats} />
    </div>
  );
}
