import { sql } from "./db";
import type {
  Player,
  Metric,
  Game,
  GameWithDetails,
  PlayerStats,
  LeaderboardEntry,
  DashboardStats,
} from "./types";

export async function getPlayers(): Promise<Player[]> {
  const rows = await sql`SELECT uid, display_name FROM players ORDER BY display_name`;
  return rows as Player[];
}

export async function getMetrics(): Promise<Metric[]> {
  const rows = await sql`SELECT uid, display_name, type, description, sort_order FROM metrics ORDER BY sort_order`;
  return rows as Metric[];
}

export async function getInputMetrics(): Promise<Metric[]> {
  const rows = await sql`SELECT uid, display_name, type, description, sort_order FROM metrics WHERE type = 'input' ORDER BY sort_order`;
  return rows as Metric[];
}

export async function getGames(): Promise<Game[]> {
  const rows = await sql`SELECT id, date, location, notes FROM games ORDER BY id DESC`;
  return rows as Game[];
}

export async function getGameById(id: number): Promise<GameWithDetails | null> {
  const [gameRows, playerRows, resultRows] = await Promise.all([
    sql`SELECT id, date, location, notes FROM games WHERE id = ${id}`,
    sql`
      SELECT p.uid, p.display_name 
      FROM game_players gp 
      JOIN players p ON p.uid = gp.player_uid 
      WHERE gp.game_id = ${id}
    `,
    sql`
      SELECT r.player_uid, r.metric_uid, r.score, m.type as metric_type
      FROM results r
      JOIN metrics m ON m.uid = r.metric_uid
      WHERE r.game_id = ${id}
    `,
  ]);

  if (gameRows.length === 0) return null;

  const game = gameRows[0] as Game;
  const players = playerRows as Player[];
  const results = resultRows as Array<{ player_uid: string; metric_uid: string; score: number; metric_type: string }>;

  // Compute totals per player (sum of input-type metric scores)
  const totals: Record<string, number> = {};
  for (const player of players) {
    totals[player.uid] = 0;
  }
  for (const result of results) {
    if (result.metric_type === "input") {
      totals[result.player_uid] = (totals[result.player_uid] || 0) + result.score;
    }
  }

  // Derive winner(s): player(s) with the max total
  const maxTotal = Math.max(...Object.values(totals));
  const winners = Object.entries(totals)
    .filter(([, total]) => total === maxTotal)
    .map(([uid]) => uid);

  return {
    ...game,
    players,
    results: results.map(({ player_uid, metric_uid, score }) => ({
      game_id: id,
      player_uid,
      metric_uid,
      score,
    })),
    totals,
    winners,
    maxTotal,
  };
}

export async function getGamesWithWinners(): Promise<
  Array<Game & { players: Player[]; winners: string[]; winnerNames: string[]; maxTotal: number }>
> {
  const games = await sql`SELECT id, date, location, notes FROM games ORDER BY id DESC`;
  
  const gamesWithDetails = await Promise.all(
    (games as Game[]).map(async (game) => {
      const [playerRows, resultRows] = await Promise.all([
        sql`
          SELECT p.uid, p.display_name 
          FROM game_players gp 
          JOIN players p ON p.uid = gp.player_uid 
          WHERE gp.game_id = ${game.id}
        `,
        sql`
          SELECT r.player_uid, r.score
          FROM results r
          JOIN metrics m ON m.uid = r.metric_uid
          WHERE r.game_id = ${game.id} AND m.type = 'input'
        `,
      ]);

      const players = playerRows as Player[];
      const results = resultRows as Array<{ player_uid: string; score: number }>;

      // Compute totals
      const totals: Record<string, number> = {};
      for (const player of players) {
        totals[player.uid] = 0;
      }
      for (const result of results) {
        totals[result.player_uid] = (totals[result.player_uid] || 0) + result.score;
      }

      const maxTotal = Math.max(...Object.values(totals), 0);
      const winners = Object.entries(totals)
        .filter(([, total]) => total === maxTotal)
        .map(([uid]) => uid);
      const winnerNames = winners.map(
        (uid) => players.find((p) => p.uid === uid)?.display_name || uid
      );

      return { ...game, players, winners, winnerNames, maxTotal };
    })
  );

  return gamesWithDetails;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const games = await getGamesWithWinners();
  const players = await getPlayers();

  // Count wins per player
  const winsCount: Record<string, number> = {};
  const gamesPlayedCount: Record<string, number> = {};
  let totalScoreSum = 0;
  let totalScoreCount = 0;
  let highestScore = { score: 0, playerUid: "", gameId: 0 };

  for (const game of games) {
    for (const player of game.players) {
      gamesPlayedCount[player.uid] = (gamesPlayedCount[player.uid] || 0) + 1;
    }
    for (const winnerUid of game.winners) {
      winsCount[winnerUid] = (winsCount[winnerUid] || 0) + 1;
    }
  }

  // Get all results for score calculations
  const allResults = await sql`
    SELECT r.game_id, r.player_uid, r.score
    FROM results r
    JOIN metrics m ON m.uid = r.metric_uid
    WHERE m.type = 'input'
  `;

  // Build per-game totals
  const gamePlayerTotals: Record<number, Record<string, number>> = {};
  for (const r of allResults as Array<{ game_id: number; player_uid: string; score: number }>) {
    if (!gamePlayerTotals[r.game_id]) gamePlayerTotals[r.game_id] = {};
    gamePlayerTotals[r.game_id][r.player_uid] = (gamePlayerTotals[r.game_id][r.player_uid] || 0) + r.score;
  }

  // Calculate stats
  for (const [gameIdStr, playerTotals] of Object.entries(gamePlayerTotals)) {
    const gameId = parseInt(gameIdStr);
    for (const [playerUid, total] of Object.entries(playerTotals)) {
      totalScoreSum += total;
      totalScoreCount++;
      if (total > highestScore.score) {
        highestScore = { score: total, playerUid, gameId };
      }
    }
  }

  // Find player with most wins
  let mostWinsPlayer = { uid: "", wins: 0 };
  for (const [uid, wins] of Object.entries(winsCount)) {
    if (wins > mostWinsPlayer.wins) {
      mostWinsPlayer = { uid, wins };
    }
  }

  const mostWinsPlayerData = players.find((p) => p.uid === mostWinsPlayer.uid);
  const highestScorePlayer = players.find((p) => p.uid === highestScore.playerUid);
  const mostRecentGame = games[0];

  return {
    totalGames: games.length,
    mostWins: {
      player: mostWinsPlayerData || { uid: "", display_name: "—" },
      wins: mostWinsPlayer.wins,
      winRate: gamesPlayedCount[mostWinsPlayer.uid]
        ? mostWinsPlayer.wins / gamesPlayedCount[mostWinsPlayer.uid]
        : 0,
    },
    highestScore: {
      score: highestScore.score,
      player: highestScorePlayer || { uid: "", display_name: "—" },
      gameId: highestScore.gameId,
    },
    avgScore: totalScoreCount > 0 ? totalScoreSum / totalScoreCount : 0,
    mostRecentGame: mostRecentGame
      ? {
          id: mostRecentGame.id,
          date: mostRecentGame.date,
          winners: mostRecentGame.winners,
          winnerNames: mostRecentGame.winnerNames,
        }
      : { id: 0, date: null, winners: [], winnerNames: [] },
  };
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const players = await getPlayers();
  const games = await getGamesWithWinners();
  const metrics = await getInputMetrics();

  // Get all results
  const allResults = await sql`
    SELECT r.game_id, r.player_uid, r.metric_uid, r.score
    FROM results r
    JOIN metrics m ON m.uid = r.metric_uid
    WHERE m.type = 'input'
  `;

  // Build per-player stats
  const playerStats: Record<string, {
    gamesPlayed: number;
    wins: number;
    scores: number[];
    metricScores: Record<string, number[]>;
  }> = {};

  // Initialize
  for (const player of players) {
    playerStats[player.uid] = {
      gamesPlayed: 0,
      wins: 0,
      scores: [],
      metricScores: {},
    };
    for (const metric of metrics) {
      playerStats[player.uid].metricScores[metric.uid] = [];
    }
  }

  // Count games and wins
  for (const game of games) {
    for (const player of game.players) {
      playerStats[player.uid].gamesPlayed++;
    }
    for (const winnerUid of game.winners) {
      if (playerStats[winnerUid]) {
        playerStats[winnerUid].wins++;
      }
    }
  }

  // Build per-game totals and metric scores
  const gamePlayerTotals: Record<number, Record<string, number>> = {};
  for (const r of allResults as Array<{ game_id: number; player_uid: string; metric_uid: string; score: number }>) {
    if (!gamePlayerTotals[r.game_id]) gamePlayerTotals[r.game_id] = {};
    gamePlayerTotals[r.game_id][r.player_uid] = (gamePlayerTotals[r.game_id][r.player_uid] || 0) + r.score;
    
    if (playerStats[r.player_uid]) {
      playerStats[r.player_uid].metricScores[r.metric_uid]?.push(r.score);
    }
  }

  // Add totals to scores
  for (const [, playerTotals] of Object.entries(gamePlayerTotals)) {
    for (const [playerUid, total] of Object.entries(playerTotals)) {
      if (playerStats[playerUid]) {
        playerStats[playerUid].scores.push(total);
      }
    }
  }

  // Build leaderboard entries
  const leaderboard: LeaderboardEntry[] = players.map((player) => {
    const stats = playerStats[player.uid];
    const avgByMetric: Record<string, number> = {};
    for (const [metricUid, scores] of Object.entries(stats.metricScores)) {
      avgByMetric[metricUid] = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    }

    return {
      player,
      gamesPlayed: stats.gamesPlayed,
      wins: stats.wins,
      winRate: stats.gamesPlayed > 0 ? stats.wins / stats.gamesPlayed : 0,
      avgScore: stats.scores.length > 0 ? stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length : 0,
      bestScore: stats.scores.length > 0 ? Math.max(...stats.scores) : 0,
      worstScore: stats.scores.length > 0 ? Math.min(...stats.scores) : 0,
      avgByMetric,
      rank: 0,
    };
  });

  // Sort by win rate descending, then by games played
  leaderboard.sort((a, b) => {
    if (b.winRate !== a.winRate) return b.winRate - a.winRate;
    return b.gamesPlayed - a.gamesPlayed;
  });

  // Assign ranks
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return leaderboard;
}

export async function getPlayerStats(uid: string): Promise<PlayerStats | null> {
  const [playerRows] = await Promise.all([
    sql`SELECT uid, display_name FROM players WHERE uid = ${uid}`,
  ]);

  if (playerRows.length === 0) return null;

  const player = playerRows[0] as Player;
  const leaderboard = await getLeaderboard();
  const entry = leaderboard.find((e) => e.player.uid === uid);

  if (!entry) {
    return {
      player,
      gamesPlayed: 0,
      wins: 0,
      winRate: 0,
      avgScore: 0,
      bestScore: 0,
      worstScore: 0,
      avgByMetric: {},
    };
  }

  return {
    player,
    gamesPlayed: entry.gamesPlayed,
    wins: entry.wins,
    winRate: entry.winRate,
    avgScore: entry.avgScore,
    bestScore: entry.bestScore,
    worstScore: entry.worstScore,
    avgByMetric: entry.avgByMetric,
  };
}

export async function getPlayerGameHistory(uid: string) {
  const games = await getGamesWithWinners();
  const playerGames = games.filter((g) => g.players.some((p) => p.uid === uid));

  // Get results for this player
  const results = await sql`
    SELECT r.game_id, r.score
    FROM results r
    JOIN metrics m ON m.uid = r.metric_uid
    WHERE r.player_uid = ${uid} AND m.type = 'input'
  `;

  // Build game totals
  const gameTotals: Record<number, number> = {};
  for (const r of results as Array<{ game_id: number; score: number }>) {
    gameTotals[r.game_id] = (gameTotals[r.game_id] || 0) + r.score;
  }

  return playerGames.map((game) => {
    // Calculate all player totals for this game to determine rank
    const allTotals = game.players.map((p) => {
      const total = games
        .find((g) => g.id === game.id)
        ?.players.reduce((sum, _) => {
          return gameTotals[game.id] || 0;
        }, 0);
      return { uid: p.uid, total: total || 0 };
    });

    const playerTotal = gameTotals[game.id] || 0;
    const sortedTotals = [...new Set(Object.values(gameTotals))].sort((a, b) => b - a);
    const rank = sortedTotals.indexOf(playerTotal) + 1;

    return {
      gameId: game.id,
      date: game.date,
      score: playerTotal,
      rank,
      isWinner: game.winners.includes(uid),
      winnerNames: game.winnerNames,
    };
  });
}

export async function getScoreTrends() {
  const games = await sql`SELECT id FROM games ORDER BY id ASC`;
  const players = await getPlayers();
  
  const results = await sql`
    SELECT r.game_id, r.player_uid, r.score
    FROM results r
    JOIN metrics m ON m.uid = r.metric_uid
    WHERE m.type = 'input'
  `;

  // Build game totals per player
  const gameTotals: Record<number, Record<string, number>> = {};
  for (const r of results as Array<{ game_id: number; player_uid: string; score: number }>) {
    if (!gameTotals[r.game_id]) gameTotals[r.game_id] = {};
    gameTotals[r.game_id][r.player_uid] = (gameTotals[r.game_id][r.player_uid] || 0) + r.score;
  }

  // Build trend data
  const trendData = (games as Array<{ id: number }>).map((game) => {
    const dataPoint: Record<string, number | null> = { game: game.id };
    for (const player of players) {
      dataPoint[player.uid] = gameTotals[game.id]?.[player.uid] ?? null;
    }
    return dataPoint;
  });

  return { trendData, players };
}

export async function getRadarData() {
  const players = await getPlayers();
  const metrics = await getInputMetrics();
  
  const results = await sql`
    SELECT r.player_uid, r.metric_uid, r.score
    FROM results r
    JOIN metrics m ON m.uid = r.metric_uid
    WHERE m.type = 'input'
  `;

  // Build per-player per-metric averages
  const playerMetricScores: Record<string, Record<string, number[]>> = {};
  for (const player of players) {
    playerMetricScores[player.uid] = {};
    for (const metric of metrics) {
      playerMetricScores[player.uid][metric.uid] = [];
    }
  }

  for (const r of results as Array<{ player_uid: string; metric_uid: string; score: number }>) {
    playerMetricScores[r.player_uid]?.[r.metric_uid]?.push(r.score);
  }

  // Calculate averages
  const radarData = metrics.map((metric) => {
    const dataPoint: Record<string, string | number> = { metric: metric.display_name };
    for (const player of players) {
      const scores = playerMetricScores[player.uid][metric.uid];
      dataPoint[player.uid] = scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : 0;
    }
    return dataPoint;
  });

  return { radarData, players, metrics };
}

export async function getWinDistribution() {
  const games = await getGamesWithWinners();
  const players = await getPlayers();

  const winsCount: Record<string, number> = {};
  for (const player of players) {
    winsCount[player.uid] = 0;
  }

  for (const game of games) {
    for (const winnerUid of game.winners) {
      winsCount[winnerUid] = (winsCount[winnerUid] || 0) + 1;
    }
  }

  return players
    .map((player) => ({
      name: player.display_name,
      uid: player.uid,
      wins: winsCount[player.uid] || 0,
    }))
    .filter((p) => p.wins > 0)
    .sort((a, b) => b.wins - a.wins);
}
