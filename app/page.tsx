import { SummaryCards } from "@/components/stats/summary-cards";
import { Leaderboard } from "@/components/stats/leaderboard";
import { RecentGames } from "@/components/stats/recent-games";
import { ScoreTrendChart } from "@/components/stats/score-trend-chart";
import { MetricRadarChart } from "@/components/stats/metric-radar-chart";
import { WinDonutChart } from "@/components/stats/win-donut-chart";
import {
  getDashboardStats,
  getLeaderboard,
  getGamesWithWinners,
  getScoreTrends,
  getRadarData,
  getWinDistribution,
} from "@/lib/queries";

export default async function DashboardPage() {
  const [stats, leaderboard, games, trendData, radarData, winData] = await Promise.all([
    getDashboardStats(),
    getLeaderboard(),
    getGamesWithWinners(),
    getScoreTrends(),
    getRadarData(),
    getWinDistribution(),
  ]);

  return (
    <div className="space-y-8">
      <SummaryCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Leaderboard entries={leaderboard} />
        </div>
        <div>
          <RecentGames games={games} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ScoreTrendChart data={trendData.trendData} players={trendData.players} />
        <MetricRadarChart data={radarData.radarData} players={radarData.players} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <WinDonutChart data={winData} />
      </div>
    </div>
  );
}
