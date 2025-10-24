import type { Game } from "./GamesListContext";

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

export interface MockBadge {
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
      my: MockBadge[];
      opponent: MockBadge[];
    }
  >;
  allBadges: Record<string, MockBadge>;
  recentCounts: {
    my: number;
    opponent: number;
  };
}

const MINUTES_PER_GAME = 40;

const colorPalettes = [
  { gradient: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)", accent: "#f857a6" },
  { gradient: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)", accent: "#5ee7df" },
  { gradient: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", accent: "#a6c1ee" },
  { gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)", accent: "#ff9a9e" },
  { gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", accent: "#fda085" },
  { gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", accent: "#84fab0" },
  { gradient: "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)", accent: "#cfd9df" },
];

const rarityCycle: MockBadge["rarity"][] = ["common", "rare", "epic", "legendary"];

const fallbackGameImages = ["/vite.svg"];

function ensureYears(years: number[]): number[] {
  if (years.length > 0) {
    return [...years].sort((a, b) => a - b);
  }
  const now = new Date().getFullYear();
  return [now - 2, now - 1, now];
}

function ensureGames(games: Game[]) {
  if (games.length) {
    return games;
  }
  return fallbackGameImages.map((url, index) => ({
    id: `placeholder-${index}`,
    name: "Mystery Game",
    imageUrl: url,
    sessions: [],
    lastSession: null,
    stats: {
      totalPlays: 0,
      thomasWins: 0,
      auroreWins: 0,
      playCounts: [],
      scoreStatsAurore: {
        percentageVictories: 0,
        highest: 0,
        lowest: 0,
        mean: 0,
      },
      scoreStatsThomas: {
        percentageVictories: 0,
        highest: 0,
        lowest: 0,
        mean: 0,
      },
    },
  } as Game));
}

function formatDateLabel(year: number, monthIndex: number, day: number) {
  const date = new Date(year, monthIndex, day);
  const label = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const iso = date.toISOString();
  return { label, iso };
}

function makeBadgeId(player: BadgePlayer, year: number, type: BadgeType, key: string) {
  return `${player}-${year}-${type}-${key}`;
}

function streakLabel(length: number) {
  return `${length} game streak`;
}

function milestoneLabel(count: number) {
  return `${count} lifetime wins`;
}

function estimateXp(length: number, bonus = 0) {
  return length * 25 + bonus;
}

function createStreakBadge(
  player: BadgePlayer,
  year: number,
  streakLength: number,
  paletteIndex: number,
  game: Game,
  occurrenceOffset: number
): MockBadge {
  const palette = colorPalettes[paletteIndex % colorPalettes.length];
  const rarity = rarityCycle[(streakLength / 5 - 1) % rarityCycle.length];
  const firstStart = formatDateLabel(year, occurrenceOffset % 12, (occurrenceOffset % 20) + 2);
  const firstEnd = formatDateLabel(year, (occurrenceOffset + 1) % 12, ((occurrenceOffset + 5) % 20) + 6);
  const secondStart = formatDateLabel(year, (occurrenceOffset + 4) % 12, ((occurrenceOffset + 3) % 25) + 1);
  const secondEnd = formatDateLabel(year, (occurrenceOffset + 5) % 12, ((occurrenceOffset + 7) % 25) + 3);

  const streakOccurrences: BadgeStreakOccurrence[] = [
    {
      id: `${player}-${year}-streak-${streakLength}-a`,
      startLabel: firstStart.label,
      startISO: firstStart.iso,
      endLabel: firstEnd.label,
      endISO: firstEnd.iso,
      length: streakLength,
      highlight: "Swept through the monthly league",
    },
    {
      id: `${player}-${year}-streak-${streakLength}-b`,
      startLabel: secondStart.label,
      startISO: secondStart.iso,
      endLabel: secondEnd.label,
      endISO: secondEnd.iso,
      length: streakLength,
      highlight: "Perfect weekend run",
    },
  ];

  return {
    id: makeBadgeId(player, year, "streak", `${streakLength}`),
    player,
    year,
    type: "streak",
    title: streakLabel(streakLength),
    subtitle: `${streakLength} wins in a row`
      + (player === "my" ? " - unstoppable momentum!" : " - rival in top form."),
    tierLabel: `${streakLength}x Combo`,
    description:
      "Achieved a flawless streak, chaining together victories without dropping a single match.",
    gradient: palette.gradient,
    accentColor: palette.accent,
    textColor: "#0b0b0f",
    game: {
      id: game.id,
      name: game.name,
      imageUrl: game.imageUrl ?? fallbackGameImages[0],
    },
    earnedLabels: streakOccurrences.map((occurrence) => occurrence.endLabel),
    earnedDateISO: streakOccurrences.map((occurrence) => occurrence.endISO),
    streaks: streakOccurrences,
    xpValue: estimateXp(streakLength, 80),
    rarity,
  };
}

function createGameStreakBadge(
  player: BadgePlayer,
  year: number,
  streakLength: number,
  paletteIndex: number,
  game: Game
): MockBadge {
  const palette = colorPalettes[(paletteIndex + 2) % colorPalettes.length];
  const rarity = rarityCycle[(streakLength / 5) % rarityCycle.length];
  const earned = formatDateLabel(year, (paletteIndex + 6) % 12, 12);
  const streakStart = formatDateLabel(year, (paletteIndex + 3) % 12, 4);
  const streakEnd = formatDateLabel(year, (paletteIndex + 4) % 12, 9);

  return {
    id: makeBadgeId(player, year, "game-streak", `${game.id ?? "game"}-${streakLength}`),
    player,
    year,
    type: "game-streak",
    title: `${game.name} mastery`,
    subtitle: `${streakLength} consecutive wins on ${game.name}`,
    tierLabel: `${streakLength}x ${game.name}`,
    description: `Dominated ${game.name} with consecutive victories, leaving no chance to the opponent.`,
    gradient: palette.gradient,
    accentColor: palette.accent,
    textColor: "#06121a",
    game: {
      id: game.id,
      name: game.name,
      imageUrl: game.imageUrl ?? fallbackGameImages[0],
    },
    earnedLabels: [earned.label],
    earnedDateISO: [earned.iso],
    streaks: [
      {
        id: `${player}-${year}-game-${game.id}-streak`,
        startLabel: streakStart.label,
        startISO: streakStart.iso,
        endLabel: streakEnd.label,
        endISO: streakEnd.iso,
        length: streakLength,
        highlight: `Flawless run on ${game.name}`,
      },
    ],
    xpValue: estimateXp(streakLength, 120),
    rarity,
  };
}

function createMilestoneBadge(
  player: BadgePlayer,
  year: number,
  wins: number,
  paletteIndex: number,
  game: Game
): MockBadge {
  const palette = colorPalettes[(paletteIndex + 4) % colorPalettes.length];
  const rarity = wins >= 100 ? "legendary" : wins >= 50 ? "epic" : wins >= 30 ? "rare" : "common";

  const earned = formatDateLabel(year, (paletteIndex + 8) % 12, 20);

  return {
    id: makeBadgeId(player, year, "milestone", `${game.id ?? "game"}-${wins}`),
    player,
    year,
    type: "milestone",
    title: `${wins}+ wins on ${game.name}`,
    subtitle: `Lifetime achievement unlocked for ${game.name}`,
    tierLabel: milestoneLabel(wins),
    description: `Celebrates a monumental lifetime achievement with over ${wins} victories on ${game.name}.`,
    gradient: palette.gradient,
    accentColor: palette.accent,
    textColor: "#10141f",
    game: {
      id: game.id,
      name: game.name,
      imageUrl: game.imageUrl ?? fallbackGameImages[0],
    },
    earnedLabels: [earned.label],
    earnedDateISO: [earned.iso],
    milestoneCount: wins,
    xpValue: wins * 20 + MINUTES_PER_GAME,
    rarity,
  };
}

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

export function generateMockBadges(years: number[], games: Game[]): BadgeCollections {
  const ensuredYears = ensureYears(years);
  const ensuredGames = ensureGames(games);
  const byYear: BadgeCollections["byYear"] = {};
  const allBadges: Record<string, MockBadge> = {};
  let myRecent = 0;
  let opponentRecent = 0;
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

  ensuredYears.forEach((year, yearIndex) => {
    const myBadges: MockBadge[] = [];
    const opponentBadges: MockBadge[] = [];

    const baseGame = ensuredGames[yearIndex % ensuredGames.length];
    const secondaryGame = ensuredGames[(yearIndex + 1) % ensuredGames.length];
    const tertiaryGame = ensuredGames[(yearIndex + 2) % ensuredGames.length];

    const streakLengths = [5 + (yearIndex % 3) * 5, 10 + (yearIndex % 2) * 5];
    const milestoneWins = [20 + yearIndex * 10, 50 + yearIndex * 10];

    streakLengths.forEach((length, index) => {
      const myBadge = createStreakBadge("my", year, length, yearIndex + index, ensuredGames[(yearIndex + index) % ensuredGames.length], index * 3 + yearIndex);
      const opponentBadge = createStreakBadge("opponent", year, length + 5, yearIndex + index + 1, ensuredGames[(yearIndex + index + 1) % ensuredGames.length], index * 4 + yearIndex + 2);

      myBadges.push(myBadge);
      opponentBadges.push(opponentBadge);
    });

    myBadges.push(
      createGameStreakBadge("my", year, 5 + yearIndex * 5, yearIndex + 2, baseGame)
    );
    opponentBadges.push(
      createGameStreakBadge("opponent", year, 10 + yearIndex * 5, yearIndex + 3, secondaryGame)
    );

    milestoneWins.forEach((wins, index) => {
      myBadges.push(
        createMilestoneBadge("my", year, wins, yearIndex + index + 1, index % 2 === 0 ? baseGame : tertiaryGame)
      );
      opponentBadges.push(
        createMilestoneBadge("opponent", year, wins + 10, yearIndex + index + 2, index % 2 === 0 ? secondaryGame : baseGame)
      );
    });

    byYear[year] = {
      my: myBadges,
      opponent: opponentBadges,
    };

    [...myBadges, ...opponentBadges].forEach((badge) => {
      const recent = badge.earnedDateISO.some((iso) => {
        const earnedDate = new Date(iso);
        return earnedDate >= fifteenDaysAgo;
      });
      if (recent) {
        if (badge.player === "my") {
          myRecent += 1;
        } else {
          opponentRecent += 1;
        }
      }
      allBadges[badge.id] = badge;
    });
  });

  return {
    yearsUsed: ensuredYears,
    byYear,
    allBadges,
    recentCounts: {
      my: myRecent,
      opponent: opponentRecent,
    },
  };
}

export function getMockBadgeById(
  collections: BadgeCollections,
  badgeId: string
): MockBadge | undefined {
  return collections.allBadges[badgeId];
}

