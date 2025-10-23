import type { AggregatedStats } from "../data/GamesListContext";
import "./SummaryStats.scss";

function SummaryStats({
  aggregatedStats,
}: {
  aggregatedStats: AggregatedStats;
}) {
  const { totalPlays, auroreWins, thomasWins } = aggregatedStats;
  return (
    <>
      <section className="stats-summary" tabIndex={-1}>
        <article className="summary-card">
          <span className="summary-label">Total games played</span>
          <span className="summary-value">{totalPlays}</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Aurore victories</span>
          <span className="summary-value">{auroreWins}</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Thomas victories</span>
          <span className="summary-value">{thomasWins}</span>
        </article>
      </section>
    </>
  );
}

export default SummaryStats;
