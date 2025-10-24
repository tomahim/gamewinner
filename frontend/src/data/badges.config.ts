import type { BadgeType } from "./badges.types";

export interface StreakBadgeTier {
  length: number;
  xp: number;
}

export interface GameStreakTier {
  length: number;
  xp: number;
}

export interface MilestoneTier {
  wins: number;
  xp: number;
}

export interface BadgeConfig {
  streak: StreakBadgeTier[];
  gameStreak: GameStreakTier[];
  milestone: MilestoneTier[];
}

export const badgeConfig: BadgeConfig = {
  streak: [
    { length: 5, xp: 150 },
    { length: 10, xp: 400 },
    { length: 15, xp: 700 },
    { length: 20, xp: 1000 },
    { length: 25, xp: 1400 },
  ],
  gameStreak: [
    { length: 5, xp: 200 },
    { length: 10, xp: 450 },
    { length: 15, xp: 800 },
    { length: 20, xp: 1100 },
  ],
  milestone: [
    { wins: 10, xp: 120 },
    { wins: 20, xp: 250 },
    { wins: 30, xp: 400 },
    { wins: 50, xp: 750 },
    { wins: 75, xp: 1050 },
    { wins: 100, xp: 1500 },
    { wins: 150, xp: 2200 },
  ],
};

export function getStreakTiers() {
  return badgeConfig.streak.map((tier) => tier.length).sort((a, b) => a - b);
}

export function getGameStreakTiers() {
  return badgeConfig.gameStreak
    .map((tier) => tier.length)
    .sort((a, b) => a - b);
}

export function getMilestoneTiers() {
  return badgeConfig.milestone.map((tier) => tier.wins).sort((a, b) => a - b);
}

export function getXpForBadge(type: BadgeType, threshold: number) {
  switch (type) {
    case "streak": {
      const match = badgeConfig.streak.find((tier) => tier.length === threshold);
      return match?.xp ?? 0;
    }
    case "game-streak": {
      const match = badgeConfig.gameStreak.find((tier) => tier.length === threshold);
      return match?.xp ?? 0;
    }
    case "milestone": {
      const match = badgeConfig.milestone.find((tier) => tier.wins === threshold);
      return match?.xp ?? 0;
    }
    default:
      return 0;
  }
}
