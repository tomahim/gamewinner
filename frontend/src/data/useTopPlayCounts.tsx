import { useMemo } from "react";
import type { AggregatedStats, PlayCount } from "./GamesListContext";

export interface TopPlayCountsResult {
  topThree: PlayCount[];
  remainingTopTen: PlayCount[];
  countRange: { min: number; max: number };
}

export const useTopPlayCounts = (
  aggregatedStats: AggregatedStats | null
): TopPlayCountsResult => {
  const topPlayCounts = useMemo<PlayCount[]>(() => {
    if (!aggregatedStats) {
      return [];
    }
    return aggregatedStats.playCounts.slice(0, 100);
  }, [aggregatedStats]);

  const topThree = useMemo(() => topPlayCounts.slice(0, 3), [topPlayCounts]);

  const remainingTopTen = useMemo(
    () => topPlayCounts.slice(3, 100),
    [topPlayCounts]
  );

  const countRange = useMemo(() => {
    if (!topPlayCounts.length) {
      return { min: 0, max: 0 };
    }
    const counts = topPlayCounts.map((pc) => pc.count);
    return {
      min: Math.min(...counts),
      max: Math.max(...counts),
    };
  }, [topPlayCounts]);

  return { topThree, remainingTopTen, countRange };
};
