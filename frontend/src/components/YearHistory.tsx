import { useNavigate } from "react-router-dom";
import "./YearHistory.scss";
import {
  useYearStatsFromParams,
  useYearsWithStats,
  type MonthStats,
} from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import ImageCircle from "./ui/ImageCircle";
import Loader from "./ui/Loader";

function HistoryCard({
  month,
  winner,
  scoreAurore,
  scoreThomas,
}: {
  month: string;
  winner: "Aurore" | "Thomas" | "Tie";
  scoreAurore: number;
  scoreThomas: number;
}) {
  return (
    <div key={month} className="session-card">
      <ImageCircle player={winner} />
      <div>
        {month} - Score: {winner === "Aurore" ? scoreAurore : scoreThomas} -{" "}
        {winner === "Aurore" ? scoreThomas : scoreAurore}
      </div>
    </div>
  );
}

function getMonthName(monthNumber: number) {
  // Month number should be 0-11
  const date = new Date(2025, monthNumber, 1); // Year and day are arbitrary
  return date.toLocaleString("en-US", { month: "long" }); // e.g., "January"
}

function YearHistory() {
  const { years } = useYearsWithStats();
  const { yearStats, loading, year } = useYearStatsFromParams();
  const navigate = useNavigate();

  if (loading) {
    return <Loader />;
  }

  if (!yearStats) {
    return (
      <>Cannot find stats for year {year}. Please go back to Stats page.</>
    );
  }

  const hasPreviousYear = years.includes(year - 1);
  const hasNextYear = years.includes(year + 1);

  const goToYear = (targetYear: number) => {
    navigate(`/history/${targetYear}`);
  };

  return (
    <>
      <Header title="History" />

      <div className="year-container">
        <div
          className="material-icons large-icon previous-icon"
          onClick={() => goToYear(year - 1)}
        >
          {hasPreviousYear && "chevron_left"}
        </div>

        <div>
          <h2>{year}</h2>
        </div>

        <div
          className="material-icons large-icon next-icon"
          onClick={() => goToYear(year + 1)}
        >
          {hasNextYear && "chevron_right"}
        </div>
      </div>

      {yearStats.months.map((ms: MonthStats) => (
        <HistoryCard
          key={ms.month}
          month={getMonthName(ms.month)}
          winner={
            ms.auroreWins > ms.thomasWins
              ? "Aurore"
              : ms.thomasWins > ms.auroreWins
              ? "Thomas"
              : "Tie"
          }
          scoreAurore={ms.auroreWins}
          scoreThomas={ms.thomasWins}
        />
      ))}

      <FooterNav />
    </>
  );
}

export default YearHistory;
