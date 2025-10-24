import React, { createContext, useContext, useState, useEffect } from "react";
import { db, auth } from "../firebase.config"; // Adjust the import based on your Firebase setup
import { getDocs, collection } from "firebase/firestore";
import { useParams } from "react-router-dom";

interface GameAttributes {
  id: string;
  name: string;
  imageUrl: string;
}

export interface GameSession {
  id: string;
  date: Date;
  game: GameAttributes;
  scoreAurore: number;
  scoreThomas: number;
  winner: "Thomas" | "Aurore";
}

export interface ScoreStats {
  percentageVictories: number;
  highest: number;
  lowest: number;
  mean: number;
}

export interface PlayCount {
  game: GameAttributes;
  count: number;
}

export interface AggregatedStats {
  totalPlays: number;
  thomasWins: number;
  auroreWins: number;
  playCounts: PlayCount[];
}

export interface GameStats extends AggregatedStats {
  scoreStatsAurore: ScoreStats;
  scoreStatsThomas: ScoreStats;
}

export interface Game extends GameAttributes {
  sessions: GameSession[];
  lastSession: Date | null;
  stats: GameStats;
}

export interface MonthStats extends AggregatedStats {
  month: number;
  sessions: GameSession[];
}

export interface YearStats extends AggregatedStats {
  year: number;
  months: MonthStats[];
}

interface OverallStats extends AggregatedStats {}

interface GamesListContextType {
  games: Game[];
  loading: boolean;
  refresh: () => void;
  overallStats: OverallStats | undefined;
  yearsStats: YearStats[];
}

const GamesListContext = createContext<GamesListContextType | undefined>(
  undefined
);

// Custom hook to use the GamesList context
export const useGamesList = () => {
  const context = useContext(GamesListContext);
  if (!context) {
    throw new Error("useGamesList must be used within a GamesListProvider");
  }
  return context;
};

export const useYearsWithStats = () => {
  const { yearsStats, loading, refresh } = useGamesList();
  const years = yearsStats.map((ys) => ys.year);
  return { years, loading, refresh, yearsStats };
};

export const useYearStatsFromParams = () => {
  const { yearsStats, loading, refresh } = useGamesList();

  const { year: yearStr } = useParams<{ year: string }>();
  if (!yearStr) {
    throw new Error("Year parameter is missing");
  }

  const year = parseInt(yearStr);

  const yearStats = yearsStats.find((ys) => ys.year === year);

  return { yearStats, year, loading, refresh };
};

export const useMonthStatsFromParams = () => {
  const { yearStats, year, loading, refresh } = useYearStatsFromParams();

  const { month: monthStr } = useParams<{ month: string }>();

  if (!monthStr) {
    throw new Error("Month parameter is missing");
  }

  const month = parseInt(monthStr);

  const monthStats = yearStats?.months.find((ms) => ms.month === month);

  return { monthStats, month, year, loading, refresh };
};

export const useGameFromParams = () => {
  const { games, loading, refresh } = useGamesList();

  const { id } = useParams<{ id: string }>();

  const game = games.find((g) => g.id === id);

  return { game, id, loading, refresh };
};

export const useGameSessionFromParams = () => {
  const { game, id: gameId, loading, refresh } = useGameFromParams();
  const { sessionId } = useParams<{ id: string; sessionId: string }>();

  const returnValues = {
    game,
    gameId,
    loading,
    refresh,
    session: null,
    sessionId: null,
  };
  if (!sessionId) {
    return returnValues;
  }

  const session = game?.sessions.find((s) => s.id === sessionId);

  return { ...returnValues, session, sessionId };
};

export const useOverallStats = () => {
  const { overallStats, loading, refresh } = useGamesList();
  return { overallStats, loading, refresh };
};

function computeGameStats(sessions: GameSession[]): GameStats {
  function mean(arr: number[]) {
    const mean =
      arr.reduce(function (a, b) {
        return a + b;
      }, 0) / arr.length;

    return Math.round(mean * 100) / 100;
  }

  function percentage(partialValue: number, totalValue: number) {
    return Math.round(((100 * partialValue) / totalValue) * 10) / 10;
  }

  const scoresAurore = sessions.map((s) => s.scoreAurore);
  const scoresThomas = sessions.map((s) => s.scoreThomas);

  return {
    totalPlays: sessions.length,
    thomasWins: sessions.filter((s) => s.winner === "Thomas").length,
    auroreWins: sessions.filter((s) => s.winner === "Aurore").length,
    scoreStatsAurore: {
      percentageVictories: percentage(
        sessions.filter((s) => s.winner === "Aurore").length,
        sessions.length
      ),
      highest: Math.max(...scoresAurore),
      lowest: Math.min(...scoresAurore),
      mean: mean(scoresAurore),
    },
    scoreStatsThomas: {
      percentageVictories: percentage(
        sessions.filter((s) => s.winner === "Thomas").length,
        sessions.length
      ),
      highest: Math.max(...scoresThomas),
      lowest: Math.min(...scoresThomas),
      mean: mean(scoresThomas),
    },
    // not needed for game stats, but to comply with AggregatedStats
    playCounts: [],
  };
}

function getUniqueGamesPlayCount(sessions: GameSession[]): PlayCount[] {
  const res = sessions.reduce((acc: PlayCount[], session: GameSession) => {
    const existing = acc.find((a) => a.game.id === session.game.id);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ game: session.game, count: 1 });
    }
    return acc;
  }, []);
  return res;
}

function computeYearsStats(sessions: GameSession[]): YearStats[] {
  const uniqueYears = [...new Set(sessions.map((s) => s.date.getFullYear()))];
  const yearsStats: YearStats[] = uniqueYears.map((year) => {
    const sessionsInYear = sessions.filter(
      (s) => s.date.getFullYear() === year
    );
    const monthsStats: MonthStats[] = [];
    for (let month = 0; month < 12; month++) {
      const sessionsInMonth = sessionsInYear.filter(
        (s) => s.date.getMonth() === month
      );
      if (sessionsInMonth.length > 0) {
        const aggregatedStats: AggregatedStats = {
          totalPlays: sessionsInMonth.length,
          thomasWins: sessionsInMonth.filter((s) => s.winner === "Thomas")
            .length,
          auroreWins: sessionsInMonth.filter((s) => s.winner === "Aurore")
            .length,
          playCounts: getUniqueGamesPlayCount(sessionsInMonth).sort(
            (a, b) => b.count - a.count
          ),
        };
        monthsStats.push({
          month,
          ...aggregatedStats,
          sessions: sessionsInMonth,
        });
      }
    }
    const sortedMonthsStats = monthsStats.sort((a, b) => b.month - a.month);
    const aggregatedYearStats: AggregatedStats = {
      totalPlays: sessionsInYear.length,
      thomasWins: sessionsInYear.filter((s) => s.winner === "Thomas").length,
      auroreWins: sessionsInYear.filter((s) => s.winner === "Aurore").length,
      playCounts: getUniqueGamesPlayCount(sessionsInYear).sort(
        (a, b) => b.count - a.count
      ),
    };
    return { year, months: sortedMonthsStats, ...aggregatedYearStats };
  });
  const sortedYearsStats = yearsStats.sort((a, b) => b.year - a.year);
  return sortedYearsStats;
}

function computeOverallStats(yearsStats: YearStats[]): OverallStats {
  const overall: OverallStats = {
    totalPlays: yearsStats.reduce((sum, ys) => sum + ys.totalPlays, 0),
    thomasWins: yearsStats.reduce((sum, ys) => sum + ys.thomasWins, 0),
    auroreWins: yearsStats.reduce((sum, ys) => sum + ys.auroreWins, 0),
    playCounts: yearsStats
      .reduce((acc: PlayCount[], ys) => {
        ys.playCounts.forEach((pc) => {
          const existing = acc.find((a) => a.game.id === pc.game.id);
          if (existing) {
            existing.count += pc.count;
          } else {
            acc.push({ game: pc.game, count: pc.count });
          }
        });
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count),
  };
  return overall;
}

// GamesList Provider component
export const GamesListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats | undefined>(
    undefined
  );
  const [yearsStats, setYearsStats] = useState<YearStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTimestamp, setRefreshTimestamp] = useState(
    new Date().getTime()
  );

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const gamesQuery = await getDocs(collection(db, "games"));
          const gamesResults = gamesQuery.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as unknown as Game[];

          const sessionsQuery = await getDocs(collection(db, "sessions"));
          let sessionsResults = sessionsQuery.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            date: doc.data().date.toDate(),
            game: gamesResults.find((g) => g.id === doc.data().game.id),
          })) as unknown as GameSession[];

          // order sessions by date descending
          sessionsResults = sessionsResults.sort(
            (a, b) => b.date.getTime() - a.date.getTime()
          );

          const statsByYears = computeYearsStats(sessionsResults);
          setYearsStats(statsByYears);
          setOverallStats(computeOverallStats(statsByYears));

          gamesResults.forEach((game, index) => {
            gamesResults[index].sessions = sessionsResults.filter(
              (session) => session.game.id === game.id
            );
            gamesResults[index].lastSession = gamesResults[index].sessions
              .length
              ? new Date(
                  Math.max(
                    ...gamesResults[index].sessions.map((session) =>
                      session.date.getTime()
                    )
                  )
                )
              : null;

            game.stats = computeGameStats(game.sessions);
          });

          setGames(gamesResults);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [refreshTimestamp]);

  return (
    <GamesListContext.Provider
      value={{
        games,
        loading,
        overallStats,
        yearsStats,
        refresh: () => setRefreshTimestamp(new Date().getTime()),
      }}
    >
      {children}
    </GamesListContext.Provider>
  );
};
