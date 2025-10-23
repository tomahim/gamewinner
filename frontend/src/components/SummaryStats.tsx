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
      <section className="stats-summary">
        <article className="summary-card">
          <span className="summary-label" tabIndex={-1}>
            Total games played
          </span>
          <span className="summary-value" tabIndex={-1}>
            {totalPlays}
          </span>
        </article>
        <article className="summary-card">
          <span className="summary-label" tabIndex={-1}>
            Aurore victories
          </span>
          <span className="summary-value" tabIndex={-1}>
            {auroreWins}
          </span>
        </article>
        <article className="summary-card">
          <span className="summary-label" tabIndex={-1}>
            Thomas victories
          </span>
          <span className="summary-value" tabIndex={-1}>
            {thomasWins}
          </span>
        </article>
      </section>
    </>
  );
}

export default SummaryStats;
