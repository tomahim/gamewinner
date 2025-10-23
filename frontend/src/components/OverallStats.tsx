import { useOverallStats } from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import Loader from "./ui/Loader";
import "./Stats.scss";
import PlayCountPodium from "./PlayCountPodium";
import TopTenList from "./TopTenList";
import SummaryStats from "./SummaryStats";
import { useTopPlayCounts } from "../data/useTopPlayCounts";

function OverallStats() {
  const { overallStats, loading } = useOverallStats();
  const { topThree, remainingTopTen, countRange } = useTopPlayCounts(
    overallStats ?? null
  );

  if (loading) {
    return <Loader />;
  }

  if (!overallStats) {
    return <>No stats available.</>;
  }

  return (
    <>
      <Header title="Overall Stats" />
      <main className="stats-page margin-bottom-80">
        <SummaryStats aggregatedStats={overallStats} />

        <PlayCountPodium topThree={topThree} />

        {remainingTopTen.length > 0 && (
          <TopTenList
            title="Other games played"
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

export default OverallStats;
