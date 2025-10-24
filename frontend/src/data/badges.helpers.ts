import type { BadgeType } from "./badges.types";

export function getBadgeTypeLabel(type: BadgeType) {
  switch (type) {
    case "streak":
      return "Streak";
    case "game-streak":
      return "Game streak";
    case "milestone":
      return "Lifetime wins";
    default:
      return "Badge";
  }
}
