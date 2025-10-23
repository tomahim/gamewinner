import { useOverallStats } from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import Loader from "./ui/Loader";

function Stats() {
  const { overallStats, loading } = useOverallStats();
  console.log("Overall Stats:", overallStats);
  if (loading) {
    return <Loader />;
  }

  if (!overallStats) {
    return <>No stats available.</>;
  }

  return (
    <>
      <Header title="Stats" />
      <div>Total played: {overallStats?.totalPlays}</div>
      <div>Aurore wins: {overallStats?.auroreWins}</div>
      <div>Thomas wins: {overallStats?.thomasWins}</div>
      <div>
        {overallStats.playCounts.map((playCount) => (
          <div key={playCount.game.id}>
            {playCount.game.name}: {playCount.count} plays
          </div>
        ))}
      </div>
      <FooterNav />
    </>
  );
}

export default Stats;
