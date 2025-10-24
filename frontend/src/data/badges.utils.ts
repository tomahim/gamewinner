import type { BadgePlayer, BadgeType } from "./badges.types";
import type { Game } from "./GamesListContext";

export function formatDateLabel(date: Date) {
  const label = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const iso = date.toISOString();
  return { label, iso };
}

export function makeBadgeId(
  player: BadgePlayer,
  year: number,
  type: BadgeType,
  key: string
) {
  return `${player}-${year}-${type}-${key}`;
}

export function findGameById(games: Game[], gameId: string | undefined) {
  if (!gameId) return undefined;
  return games.find((game) => game.id === gameId);
}

export function getBadgeGradient(index: number) {
  const gradients = [
    "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
    "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  ];
  return gradients[index % gradients.length];
}

export function getBadgeAccent(index: number) {
  const accents = [
    "#f857a6",
    "#5ee7df",
    "#a6c1ee",
    "#ff9a9e",
    "#f6d365",
    "#84fab0",
    "#cfd9df",
    "#fcb69f",
  ];
  return accents[index % accents.length];
}

export function getBadgeRarity(xp: number): "common" | "rare" | "epic" | "legendary" {
  if (xp >= 1500) return "legendary";
  if (xp >= 800) return "epic";
  if (xp >= 400) return "rare";
  return "common";
}
