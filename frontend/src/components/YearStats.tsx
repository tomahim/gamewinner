import { useYearStatsFromParams } from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import Loader from "./ui/Loader";
import "./Stats.scss";
import PlayCountPodium from "./PlayCountPodium";
import TopTenList from "./TopTenList";
import SummaryStats from "./SummaryStats";
import { useTopPlayCounts } from "../data/useTopPlayCounts";

function YearStats() {
  const { year, yearStats, loading } = useYearStatsFromParams();

  const { topThree, remainingTopTen, countRange } = useTopPlayCounts(
    yearStats ?? null
  );

  if (loading) {
    return <Loader />;
  }

  if (!yearStats) {
    return <>No stats available.</>;
  }

  return (
    <>
      <Header title={"Stats " + year} />
      <main className="stats-page margin-bottom-80">
        <SummaryStats aggregatedStats={yearStats} />

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

export default YearStats;
