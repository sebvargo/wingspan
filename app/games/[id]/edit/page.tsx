import { notFound } from "next/navigation";
import { NewGameForm } from "@/components/game/new-game-form";
import { getGameById, getPlayers, getMetrics, getLeaderboard } from "@/lib/queries";

interface EditGamePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  const { id } = await params;
  const gameId = Number(id);

  if (!Number.isInteger(gameId) || gameId <= 0) {
    notFound();
  }

  const [game, allPlayers, metrics, leaderboard] = await Promise.all([
    getGameById(gameId),
    getPlayers(),
    getMetrics(),
    getLeaderboard(),
  ]);

  if (!game) {
    notFound();
  }

  const playerStats: Record<string, { avgScore: number; gamesPlayed: number; wins: number }> = {};
  for (const entry of leaderboard) {
    playerStats[entry.player.uid] = {
      avgScore: entry.avgScore,
      gamesPlayed: entry.gamesPlayed,
      wins: entry.wins,
    };
  }

  const inputMetricUids = new Set(
    metrics.filter((metric) => metric.type === "input").map((metric) => metric.uid)
  );
  const awardMetricUids = new Set(
    metrics.filter((metric) => metric.type === "award").map((metric) => metric.uid)
  );

  const initialScores: Record<string, Record<string, number>> = {};
  for (const player of game.players) {
    initialScores[player.uid] = {};
    for (const metricUid of inputMetricUids) {
      initialScores[player.uid][metricUid] = 0;
    }
  }

  const initialAwards: Record<string, string> = {};
  for (const result of game.results) {
    if (inputMetricUids.has(result.metric_uid)) {
      if (!initialScores[result.player_uid]) {
        initialScores[result.player_uid] = {};
      }
      initialScores[result.player_uid][result.metric_uid] = result.score;
      continue;
    }

    if (awardMetricUids.has(result.metric_uid) && result.score > 0) {
      initialAwards[result.metric_uid] = result.player_uid;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-charcoal">Edit Game {game.id}</h1>
        <p className="mt-1 text-wing-brown">Update players, scores, and game details</p>
      </div>

      <NewGameForm
        allPlayers={allPlayers}
        metrics={metrics}
        playerStats={playerStats}
        mode="edit"
        gameId={game.id}
        initialDate={game.date}
        initialLocation={game.location}
        initialNotes={game.notes}
        initialSelectedPlayerUids={game.players.map((player) => player.uid)}
        initialScores={initialScores}
        initialAwards={initialAwards}
      />
    </div>
  );
}
