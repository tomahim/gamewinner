import { useNavigate } from "react-router-dom";
import {
  useMonthStatsFromParams,
  type GameSession,
} from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import SessionCard from "./SessionCard";
import SummaryStats from "./SummaryStats";
import Loader from "./ui/Loader";

export function getMonthName(monthNumber: number) {
  // Month number should be 0-11
  const date = new Date(2025, monthNumber, 1); // Year and day are arbitrary
  return date.toLocaleString("en-US", { month: "long" }); // e.g., "January"
}

function MonthHistory() {
  const navigate = useNavigate();
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

      <div className="summary-stats-container">
        <SummaryStats aggregatedStats={monthStats} />
      </div>

      <div
        className="link-with-icon"
        onClick={() => navigate(`/stats/${year}/${month}`)}
      >
        <span className="material-icons small-icon">bar_chart</span>
        See month stats
      </div>

      {monthStats.sessions.map((session: GameSession) => (
        <SessionCard
          key={session.id}
          session={session}
          refresh={refresh}
          displayGameName={true}
        />
      ))}

      <div className="margin-bottom-80" />

      <FooterNav />
    </>
  );
}

export default MonthHistory;
