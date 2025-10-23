import { useMemo } from "react";
import type { PlayCount } from "../data/GamesListContext";
import { useOverallStats } from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import Loader from "./ui/Loader";
import "./Stats.scss";
import PlayCountPodium from "./PlayCountPodium";
import TopTenList from "./TopTenList";

function Stats() {
  const { overallStats, loading } = useOverallStats();
  const topPlayCounts = useMemo<PlayCount[]>(() => {
    if (!overallStats) {
      return [];
    }
    return overallStats.playCounts.slice(0, 10);
  }, [overallStats]);

  const topThree = useMemo(
    () => topPlayCounts.slice(0, 3),
    [topPlayCounts]
  );
  const remainingTopTen = useMemo(
    () => topPlayCounts.slice(3, 10),
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

  if (loading) {
    return <Loader />;
  }

  if (!overallStats) {
    return <>No stats available.</>;
  }

  return (
    <>
      <Header title="Stats" />
      <main className="stats-page margin-bottom-80">
        <section className="stats-summary">
          <article className="summary-card">
            <span className="summary-label">Total games played</span>
            <span className="summary-value">{overallStats.totalPlays}</span>
          </article>
          <article className="summary-card">
            <span className="summary-label">Aurore victories</span>
            <span className="summary-value">{overallStats.auroreWins}</span>
          </article>
          <article className="summary-card">
            <span className="summary-label">Thomas victories</span>
            <span className="summary-value">{overallStats.thomasWins}</span>
          </article>
        </section>

        <PlayCountPodium topThree={topThree} />

        {remainingTopTen.length > 0 && (
          <TopTenList
            title="Top 10 runners-up"
            items={remainingTopTen}
            startingRank={4}
            countRange={countRange}
          />
        )}
      </main>
      <FooterNav />
    </>
  );
}

export default Stats;
