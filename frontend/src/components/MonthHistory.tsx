import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMonthStatsFromParams,
  type GameSession,
  useYearsWithStats,
} from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import SessionCard from "./SessionCard";
import SummaryStats from "./SummaryStats";
import Loader from "./ui/Loader";
import "./MonthHistory.scss";

export function getMonthName(monthNumber: number) {
  // Month number should be 0-11
  const date = new Date(2025, monthNumber, 1); // Year and day are arbitrary
  return date.toLocaleString("en-US", { month: "long" }); // e.g., "January"
}

function MonthHistory() {
  const navigate = useNavigate();
  const { yearsStats } = useYearsWithStats();
  const { monthStats, loading, year, month, refresh } =
    useMonthStatsFromParams();

  const navigationTargets = useMemo(() => {
    if (year == null || month == null) {
      return { prev: null, next: null };
    }

    const yearIndex = yearsStats.findIndex((ys) => ys.year === year);
    if (yearIndex === -1) {
      return { prev: null, next: null };
    }

    const currentYearStats = yearsStats[yearIndex];
    const monthsSorted = [...currentYearStats.months]
      .map((m) => m.month)
      .sort((a, b) => a - b);
    const currentIndex = monthsSorted.indexOf(month);

    const prev = (() => {
      if (currentIndex > 0) {
        return { year, month: monthsSorted[currentIndex - 1] };
      }
      const olderYearStats = yearsStats[yearIndex + 1];
      if (!olderYearStats || olderYearStats.months.length === 0) {
        return null;
      }
      const prevMonth = Math.max(...olderYearStats.months.map((m) => m.month));
      return { year: olderYearStats.year, month: prevMonth };
    })();

    const next = (() => {
      if (currentIndex !== -1 && currentIndex < monthsSorted.length - 1) {
        return { year, month: monthsSorted[currentIndex + 1] };
      }
      const newerYearStats = yearIndex > 0 ? yearsStats[yearIndex - 1] : undefined;
      if (!newerYearStats || newerYearStats.months.length === 0) {
        return null;
      }
      const nextMonthInternal = Math.min(
        ...newerYearStats.months.map((m) => m.month)
      );
      return { year: newerYearStats.year, month: nextMonthInternal };
    })();

    return { prev, next };
  }, [yearsStats, year, month]);

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

      <div className="month-history-nav">
        <button
          className="month-history-nav__button"
          disabled={!navigationTargets.prev}
          onClick={() =>
            navigationTargets.prev &&
            navigate(
              `/history/${navigationTargets.prev.year}/${navigationTargets.prev.month}`
            )
          }
        >
          <span className="material-icons">chevron_left</span>
          Previous
        </button>
        <button
          className="month-history-nav__button"
          disabled={!navigationTargets.next}
          onClick={() =>
            navigationTargets.next &&
            navigate(
              `/history/${navigationTargets.next.year}/${navigationTargets.next.month}`
            )
          }
        >
          Next
          <span className="material-icons">chevron_right</span>
        </button>
      </div>

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
