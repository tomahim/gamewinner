import type { AggregatedStats } from "../data/GamesListContext";
import "./SummaryStats.scss";

const MINUTES_PER_GAME = 40;

export type SummaryStatsPeriodType = "overall" | "year" | "month";

type VariationResult = { delta: number; trend: "up" | "down" } | undefined;

function formatPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  return `${(Math.round(value * 10) / 10).toFixed(1)}%`;
}

function computeWinPercentage(wins: number, totalPlays: number) {
  if (!totalPlays) {
    return 0;
  }
  return (wins / totalPlays) * 100;
}

function humanizeMinutes(totalMinutes: number) {
  const absoluteMinutes = Math.abs(Math.floor(totalMinutes));
  if (!absoluteMinutes) {
    return "0 min";
  }

  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  const parts: string[] = [];

  if (days) {
    parts.push(`${days}d`);
  }

  if (remainingHours) {
    parts.push(`${remainingHours}h`);
  }

  if (minutes) {
    parts.push(`${minutes}m`);
  }

  if (!parts.length) {
    parts.push("0 min");
  }

  return parts.join(" ");
}

function formatApproximatePlayTime(totalPlays: number) {
  const totalMinutes = totalPlays * MINUTES_PER_GAME;

  return {
    label: humanizeMinutes(totalMinutes),
    minutes: totalMinutes,
  } as const;
}

function getVariation(
  current: number,
  previous: number | undefined,
  enabled: boolean
): VariationResult {
  if (!enabled || previous === undefined) {
    return undefined;
  }

  const delta = current - previous;

  if (!Number.isFinite(delta) || delta === 0) {
    return undefined;
  }

  return {
    delta,
    trend: delta > 0 ? "up" : "down",
  } as const;
}

const defaultPercentageFormatter = (delta: number) =>
  `${delta > 0 ? "+" : ""}${(Math.round(delta * 10) / 10).toFixed(1)}%`;

function renderVariation(
  variation: VariationResult,
  formatDelta: (delta: number) => string = defaultPercentageFormatter
) {
  if (!variation) {
    return null;
  }

  return (
    <span className={`summary-variation summary-variation-${variation.trend}`}>
      <span className="material-icons summary-variation-icon">
        {variation.trend === "up" ? "arrow_drop_up" : "arrow_drop_down"}
      </span>
      {formatDelta(variation.delta)}
    </span>
  );
}

function formatTimeDelta(deltaMinutes: number) {
  const magnitude = humanizeMinutes(Math.abs(deltaMinutes));
  if (magnitude === "0 min") {
    return magnitude;
  }
  return `${deltaMinutes > 0 ? "+" : "-"}${magnitude}`;
}

interface SummaryStatsProps {
  aggregatedStats: AggregatedStats;
  periodType?: SummaryStatsPeriodType;
  comparisonStats?: AggregatedStats;
}

function SummaryStats({
  aggregatedStats,
  periodType = "overall",
  comparisonStats,
}: SummaryStatsProps) {
  const { totalPlays, auroreWins, thomasWins } = aggregatedStats;

  const approximatePlayTime = formatApproximatePlayTime(totalPlays);
  const previousTotalMinutes =
    comparisonStats != null
      ? comparisonStats.totalPlays * MINUTES_PER_GAME
      : undefined;
  const approximatePlayTimeVariation = getVariation(
    approximatePlayTime.minutes,
    previousTotalMinutes,
    periodType !== "overall" && comparisonStats != null
  );

  const auroreWinPercentage = computeWinPercentage(auroreWins, totalPlays);
  const thomasWinPercentage = computeWinPercentage(thomasWins, totalPlays);

  const comparisonEnabled =
    periodType !== "overall" && (comparisonStats?.totalPlays ?? 0) > 0;

  const auroreComparisonPercentage = comparisonStats
    ? computeWinPercentage(
        comparisonStats.auroreWins,
        comparisonStats.totalPlays
      )
    : undefined;

  const thomasComparisonPercentage = comparisonStats
    ? computeWinPercentage(
        comparisonStats.thomasWins,
        comparisonStats.totalPlays
      )
    : undefined;

  const auroreVariation = getVariation(
    auroreWinPercentage,
    auroreComparisonPercentage,
    comparisonEnabled
  );
  const thomasVariation = getVariation(
    thomasWinPercentage,
    thomasComparisonPercentage,
    comparisonEnabled
  );

  return (
    <>
      <section className="stats-summary" tabIndex={-1}>
        <article className="summary-card">
          <span className="summary-label">Total games played</span>
          <span className="summary-value">{totalPlays}</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Approx. time playing</span>
          <span className="summary-value">{approximatePlayTime.label}</span>
          {renderVariation(approximatePlayTimeVariation, formatTimeDelta)}
        </article>
        <article className="summary-card">
          <span className="summary-label">Aurore victories</span>
          <div className="summary-value-row">
            <span className="summary-value">{auroreWins}</span>
            {renderVariation(auroreVariation)}
          </div>
          <div className="summary-percentage-row">
            <span className="summary-percentage">
              {formatPercentage(auroreWinPercentage)}
            </span>
          </div>
        </article>
        <article className="summary-card">
          <span className="summary-label">Thomas victories</span>
          <div className="summary-value-row">
            <span className="summary-value">{thomasWins}</span>
            {renderVariation(thomasVariation)}
          </div>
          <div className="summary-percentage-row">
            <span className="summary-percentage">
              {formatPercentage(thomasWinPercentage)}
            </span>
          </div>
        </article>
      </section>
    </>
  );
}

export default SummaryStats;
