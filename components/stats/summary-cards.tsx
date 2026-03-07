import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp, Target, Calendar, Users } from "lucide-react";
import type { DashboardStats } from "@/lib/types";
import { formatPercent } from "@/lib/utils";
import Link from "next/link";

interface SummaryCardsProps {
  stats: DashboardStats;
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Games",
      value: stats.totalGames,
      subtext: "since Game 1",
      icon: Users,
    },
    {
      label: "Most Wins",
      value: `${stats.mostWins.player.display_name} (${stats.mostWins.wins})`,
      subtext: `${formatPercent(stats.mostWins.winRate)} win rate`,
      icon: Trophy,
    },
    {
      label: "Highest Score",
      value: stats.highestScore.score,
      subtext: `${stats.highestScore.player.display_name}, Game ${stats.highestScore.gameId}`,
      icon: TrendingUp,
    },
    {
      label: "Average Score",
      value: Math.round(stats.avgScore * 10) / 10,
      subtext: "across all games",
      icon: Target,
    },
    {
      label: "Most Recent",
      value: `Game ${stats.mostRecentGame.id}`,
      subtext: `${stats.mostRecentGame.winnerNames.join(", ")} won`,
      icon: Calendar,
      href: `/games/${stats.mostRecentGame.id}`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const content = (
          <Card key={card.label} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold text-charcoal">{card.value}</p>
                <p className="text-xs text-wing-brown">{card.subtext}</p>
              </div>
              <div className="rounded-full bg-pale-aqua p-2">
                <Icon className="h-5 w-5 text-sky-blue" />
              </div>
            </div>
          </Card>
        );

        if (card.href) {
          return (
            <Link key={card.label} href={card.href} className="transition-transform hover:scale-[1.02]">
              {content}
            </Link>
          );
        }

        return content;
      })}
    </div>
  );
}
