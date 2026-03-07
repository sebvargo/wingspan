export interface Player {
  uid: string;
  display_name: string;
}

export interface Metric {
  uid: string;
  display_name: string;
  type: "input" | "calculated" | "award";
  description: string | null;
  sort_order: number;
}

export interface Game {
  id: number;
  date: string | null;
  location: string | null;
  notes: string | null;
}

export interface GamePlayer {
  game_id: number;
  player_uid: string;
  seat_order: number | null;
}

export interface Result {
  game_id: number;
  player_uid: string;
  metric_uid: string;
  score: number;
}

export interface GameWithDetails extends Game {
  players: Player[];
  results: Result[];
  totals: Record<string, number>;
  winners: string[];
  maxTotal: number;
}

export interface PlayerStats {
  player: Player;
  gamesPlayed: number;
  wins: number;
  winRate: number;
  avgScore: number;
  bestScore: number;
  worstScore: number;
  avgByMetric: Record<string, number>;
}

export interface LeaderboardEntry extends PlayerStats {
  rank: number;
}

export interface DashboardStats {
  totalGames: number;
  mostWins: { player: Player; wins: number; winRate: number };
  highestScore: { score: number; player: Player; gameId: number };
  avgScore: number;
  mostRecentGame: {
    id: number;
    date: string | null;
    winners: string[];
    winnerNames: string[];
  };
}
