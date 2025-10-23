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
import { getMonthName } from "./MonthHistory";

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
    <div key={month} className="session-card" tabIndex={-1}>
      <ImageCircle player={winner} />
      <div>
        <b>{month}</b> - Score:{" "}
        {winner === "Aurore" ? scoreAurore : scoreThomas} -{" "}
        {winner === "Aurore" ? scoreThomas : scoreAurore}
      </div>
      <div tabIndex={-1} className="icon material-icons">
        arrow_circle_right
      </div>
    </div>
  );
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

        <div tabIndex={-1}>
          <h2>{year}</h2>
        </div>

        <div
          className="material-icons large-icon next-icon"
          onClick={() => goToYear(year + 1)}
        >
          {hasNextYear && "chevron_right"}
        </div>
      </div>

      <div
        className="link-with-icon"
        onClick={() => navigate(`/history/${year}/stats`)}
      >
        <span className="material-icons small-icon">bar_chart</span>
        See year stats
      </div>

      {yearStats.months.map((ms: MonthStats) => (
        <div
          onClick={() => {
            navigate(`/history/${year}/${ms.month}`);
          }}
        >
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
        </div>
      ))}

      <div className="margin-bottom-80" />

      <FooterNav />
    </>
  );
}

export default YearHistory;
