import { badgeConfig, getGameStreakTiers, getMilestoneTiers, getStreakTiers, getXpForBadge } from "./badges.config";
import type {
  BadgeCollections,
  BadgeComputationContext,
  BadgeStreakOccurrence,
  BaseBadge,
  BadgePlayer,
  BadgeType,
} from "./badges.types";
import type { Game, GameSession } from "./GamesListContext";
import {
  findGameById,
  formatDateLabel,
  getBadgeAccent,
  getBadgeGradient,
  getBadgeRarity,
  makeBadgeId,
} from "./badges.utils";

interface StreakSegment {
  player: BadgePlayer;
  sessions: GameSession[];
}

function groupSessionsByYear(sessions: GameSession[]) {
  const map = new Map<number, GameSession[]>();
  sessions.forEach((session) => {
    const year = session.date.getFullYear();
    if (!map.has(year)) {
      map.set(year, []);
    }
    map.get(year)?.push(session);
  });
  return map;
}

function generateStreakSegments(sessions: GameSession[]): StreakSegment[] {
  const sorted = [...sessions].sort((a, b) => a.date.getTime() - b.date.getTime());
  const segments: StreakSegment[] = [];
  let current: StreakSegment | null = null;

  sorted.forEach((session) => {
    const player: BadgePlayer = session.winner === "Thomas" ? "my" : "opponent";
    if (!current) {
      current = { player, sessions: [session] };
      segments.push(current);
      return;
    }

    const lastSession = current.sessions[current.sessions.length - 1];
    const sameGameDayLossBreak =
      player !== current.player &&
      lastSession.date.toDateString() === session.date.toDateString();

    if (player !== current.player || sameGameDayLossBreak) {
      current = { player, sessions: [session] };
      segments.push(current);
      return;
    }

    current.sessions.push(session);
  });

  return segments;
}

function mapThresholdToHighest(streakLength: number, thresholds: number[]) {
  return thresholds
    .filter((threshold) => threshold <= streakLength)
    .sort((a, b) => a - b)
    .at(-1);
}

function buildStreakOccurrences(sessions: GameSession[], streakLength: number) {
  const firstSession = sessions[0];
  const lastSession = sessions[sessions.length - 1];
  const start = formatDateLabel(firstSession.date);
  const end = formatDateLabel(lastSession.date);
  const occurrence: BadgeStreakOccurrence = {
    id: `${firstSession.id}-${lastSession.id}`,
    startLabel: start.label,
    startISO: start.iso,
    endLabel: end.label,
    endISO: end.iso,
    length: streakLength,
  };
  return occurrence;
}

function computeStreakBadges(
  player: BadgePlayer,
  streakSegment: StreakSegment,
  games: Game[],
  year: number,
  paletteIndex: number
) {
  const streakLength = streakSegment.sessions.length;
  const thresholds = getStreakTiers();
  const highest = mapThresholdToHighest(streakLength, thresholds);
  if (!highest) {
    return [] as BaseBadge[];
  }

  const occurrence = buildStreakOccurrences(streakSegment.sessions, streakLength);
  const xpValue = getXpForBadge("streak", highest);
  const gradient = getBadgeGradient(paletteIndex);
  const accentColor = getBadgeAccent(paletteIndex);
  const textColor = "#0b0b0f";

  const badge: BaseBadge = {
    id: makeBadgeId(player, year, "streak", `${highest}`),
    player,
    year,
    type: "streak",
    title: `${highest} game streak`,
    subtitle:
      streakLength === highest
        ? `${highest} wins in a row`
        : `${streakLength} wins in a row (highest tier ${highest})`,
    tierLabel: `${highest}x Combo`,
    description:
      "Chained victories without defeat, showcasing unwavering momentum.",
    gradient,
    accentColor,
    textColor,
    earnedLabels: [occurrence.endLabel],
    earnedDateISO: [occurrence.endISO],
    streaks: [occurrence],
    xpValue,
    rarity: getBadgeRarity(xpValue),
  };

  return [badge];
}

function computeGameStreakBadges(
  player: BadgePlayer,
  game: Game,
  sessions: GameSession[],
  year: number,
  paletteIndex: number
) {
  const perGameSegments = generateStreakSegments(
    sessions.filter((session) => session.game.id === game.id)
  );
  const thresholds = getGameStreakTiers();
  const badges: BaseBadge[] = [];

  perGameSegments.forEach((segment) => {
    if (segment.player !== player) return;
    const streakLength = segment.sessions.length;
    const highest = mapThresholdToHighest(streakLength, thresholds);
    if (!highest) return;

    const occurrence = buildStreakOccurrences(segment.sessions, streakLength);
    const xpValue = getXpForBadge("game-streak", highest);
    badges.push({
      id: makeBadgeId(player, year, "game-streak", `${game.id}-${highest}`),
      player,
      year,
      type: "game-streak",
      title: `${game.name} mastery`,
      subtitle: `${highest} consecutive wins on ${game.name}`,
      tierLabel: `${highest}x ${game.name}`,
      description: `Dominated ${game.name} with consecutive victories.`,
      gradient: getBadgeGradient(paletteIndex + 2),
      accentColor: getBadgeAccent(paletteIndex + 2),
      textColor: "#06121a",
      game: {
        id: game.id,
        name: game.name,
        imageUrl: game.imageUrl,
      },
      earnedLabels: [occurrence.endLabel],
      earnedDateISO: [occurrence.endISO],
      streaks: [occurrence],
      xpValue,
      rarity: getBadgeRarity(xpValue),
    });
  });

  return badges;
}

function computeMilestoneBadges(
  player: BadgePlayer,
  game: Game,
  sessions: GameSession[],
  paletteIndex: number
) {
  const wins = sessions
    .filter(
      (session) =>
        session.game.id === game.id &&
        (player === "my" ? session.winner === "Thomas" : session.winner === "Aurore")
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const thresholds = getMilestoneTiers();
  const badges: BaseBadge[] = [];

  thresholds.forEach((milestone, index) => {
    if (wins.length < milestone) {
      return;
    }
    const earnedSession = wins[milestone - 1];
    const earned = formatDateLabel(earnedSession.date);
    const xpValue = getXpForBadge("milestone", milestone);

    badges.push({
      id: makeBadgeId(player, earnedSession.date.getFullYear(), "milestone", `${game.id}-${milestone}`),
      player,
      year: earnedSession.date.getFullYear(),
      type: "milestone",
      title: `${milestone}+ wins on ${game.name}`,
      subtitle: `Lifetime achievement on ${game.name}`,
      tierLabel: `${milestone} wins`,
      description: `Celebrates surpassing ${milestone} victories on ${game.name}.`,
      gradient: getBadgeGradient(paletteIndex + 4 + index),
      accentColor: getBadgeAccent(paletteIndex + 4 + index),
      textColor: "#10141f",
      game: {
        id: game.id,
        name: game.name,
        imageUrl: game.imageUrl,
      },
      earnedLabels: [earned.label],
      earnedDateISO: [earned.iso],
      milestoneCount: milestone,
      xpValue,
      rarity: getBadgeRarity(xpValue),
    });
  });

  return badges;
}

function mergeLatestBadges(existing: BaseBadge[], incoming: BaseBadge[]) {
  const map = new Map<string, BaseBadge>();
  existing.forEach((badge) => {
    map.set(badge.id, badge);
  });
  incoming.forEach((badge) => {
    const existingBadge = map.get(badge.id);
    if (!existingBadge) {
      map.set(badge.id, badge);
      return;
    }
    const existingDate = existingBadge.earnedDateISO[0];
    const incomingDate = badge.earnedDateISO[0];
    if (incomingDate > existingDate) {
      map.set(badge.id, badge);
    }
  });
  return Array.from(map.values());
}
function computeBadgesForYear(
  year: number,
  context: BadgeComputationContext,
  paletteOffset: number
) {
  const yearSessions = context.sessions.filter(
    (session) => session.date.getFullYear() === year
  );
  const streakSegments = generateStreakSegments(yearSessions);
  const perYearMy: BaseBadge[] = [];
  const perYearOpponent: BaseBadge[] = [];

  streakSegments.forEach((segment, index) => {
    const badges = computeStreakBadges(
      segment.player,
      segment,
      context.games,
      year,
      paletteOffset + index
    );
    if (segment.player === "my") {
      badges.forEach((badge) => perYearMy.push(badge));
    } else {
      badges.forEach((badge) => perYearOpponent.push(badge));
    }
  });

  context.games.forEach((game, gameIndex) => {
    const streakBadgesMy = computeGameStreakBadges(
      "my",
      game,
      yearSessions,
      year,
      paletteOffset + streakSegments.length + gameIndex
    );
    const streakBadgesOpponent = computeGameStreakBadges(
      "opponent",
      game,
      yearSessions,
      year,
      paletteOffset + streakSegments.length + gameIndex + 1
    );

    streakBadgesMy.forEach((badge) => perYearMy.push(badge));
    streakBadgesOpponent.forEach((badge) => perYearOpponent.push(badge));

    const milestoneBadgesMy = computeMilestoneBadges(
      "my",
      game,
      context.sessions,
      paletteOffset + streakSegments.length + gameIndex + 2
    );
    const milestoneBadgesOpponent = computeMilestoneBadges(
      "opponent",
      game,
      context.sessions,
      paletteOffset + streakSegments.length + gameIndex + 3
    );

    milestoneBadgesMy.forEach((badge) => {
      if (badge.year === year) {
        perYearMy.push(badge);
      }
    });
    milestoneBadgesOpponent.forEach((badge) => {
      if (badge.year === year) {
        perYearOpponent.push(badge);
      }
    });
  });

  const filterByYear = (badges: BaseBadge[]) =>
    badges.filter((badge) =>
      badge.earnedDateISO.some((iso) => new Date(iso).getFullYear() === year)
    );

  const uniqueMy = mergeLatestBadges([], filterByYear(perYearMy));
  const uniqueOpponent = mergeLatestBadges([], filterByYear(perYearOpponent));

  return {
    my: uniqueMy,
    opponent: uniqueOpponent,
  };
}

function countRecentBadges(badges: BaseBadge[]) {
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
  return badges.filter((badge) =>
    badge.earnedDateISO.some((iso) => new Date(iso) >= fifteenDaysAgo)
  ).length;
}

export function computeBadges(context: BadgeComputationContext): BadgeCollections {
  const byYear: BadgeCollections["byYear"] = {};
  const allBadges: Record<string, BaseBadge> = {};
  let myRecent = 0;
  let opponentRecent = 0;
  let totalXp = 0;

  const years = context.years.length
    ? [...context.years]
    : Array.from(groupSessionsByYear(context.sessions).keys()).sort();

  years.forEach((year, index) => {
    const yearBadges = computeBadgesForYear(year, context, index * 7);

    byYear[year] = {
      my: yearBadges.my,
      opponent: yearBadges.opponent,
    };

    yearBadges.my.forEach((badge) => {
      allBadges[badge.id] = badge;
      totalXp += badge.xpValue;
    });
    yearBadges.opponent.forEach((badge) => {
      allBadges[badge.id] = badge;
      totalXp += badge.xpValue;
    });

    myRecent += countRecentBadges(yearBadges.my);
    opponentRecent += countRecentBadges(yearBadges.opponent);
  });

  return {
    yearsUsed: years,
    byYear,
    allBadges,
    recentCounts: {
      my: myRecent,
      opponent: opponentRecent,
    },
    totalXp,
  };
}
