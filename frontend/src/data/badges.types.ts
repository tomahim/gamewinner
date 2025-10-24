import type { GameSession, Game } from "./GamesListContext";

export type BadgePlayer = "my" | "opponent";
export type BadgeType = "streak" | "game-streak" | "milestone";

export interface BadgeStreakOccurrence {
  id: string;
  startLabel: string;
  startISO: string;
  endLabel: string;
  endISO: string;
  length: number;
  highlight?: string;
}

export interface BaseBadge {
  id: string;
  year: number;
  player: BadgePlayer;
  type: BadgeType;
  title: string;
  subtitle: string;
  tierLabel: string;
  description: string;
  gradient: string;
  accentColor: string;
  textColor: string;
  game?: {
    id?: string;
    name: string;
    imageUrl: string;
  };
  earnedLabels: string[];
  earnedDateISO: string[];
  streaks?: BadgeStreakOccurrence[];
  milestoneCount?: number;
  xpValue: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface BadgeCollections {
  yearsUsed: number[];
  byYear: Record<
    number,
    {
      my: BaseBadge[];
      opponent: BaseBadge[];
    }
  >;
  allBadges: Record<string, BaseBadge>;
  recentCounts: {
    my: number;
    opponent: number;
  };
  totalXp: number;
}

export interface BadgeComputationContext {
  games: Game[];
  sessions: GameSession[];
  years: number[];
}
