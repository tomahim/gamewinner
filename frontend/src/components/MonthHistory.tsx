import {
  useMonthStatsFromParams,
  type GameSession,
} from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import SessionCard from "./SessionCard";
import Loader from "./ui/Loader";

function getMonthName(monthNumber: number) {
  // Month number should be 0-11
  const date = new Date(2025, monthNumber, 1); // Year and day are arbitrary
  return date.toLocaleString("en-US", { month: "long" }); // e.g., "January"
}

function MonthHistory() {
  const { monthStats, loading, year, month, refresh } =
    useMonthStatsFromParams();

  if (loading) {
    return <Loader />;
  }

  if (!monthStats) {
    return (
      <>
        Cannot find stats for month {month}/{year}. Please go back to Stats
        page.
      </>
    );
  }

  return (
    <>
      <Header title={getMonthName(month) + " " + year} />

      <h2>Plays</h2>

      {monthStats.sessions.map((session: GameSession) => (
        <SessionCard
          key={session.id}
          session={session}
          refresh={refresh}
          displayGameName={true}
        />
      ))}

      <FooterNav />
    </>
  );
}

export default MonthHistory;
