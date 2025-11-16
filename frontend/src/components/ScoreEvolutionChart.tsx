import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameSession } from "../data/GamesListContext";
import EvolutionChart, { type EvolutionDatum } from "./EvolutionChart";
import scoreDetailMetrics from "../data/scoreDetailMetrics.json";

type ScoreEvolutionChartProps = {
  sessions: GameSession[];
  gameId?: string;
};

type ScoreDetailLabels = Record<string, Record<string, string>>;

const SCORE_DETAIL_LABELS = scoreDetailMetrics as ScoreDetailLabels;
const DEFAULT_METRIC = "__total__";

type MetricOption = {
  value: string;
  label: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getMetricValue(detail: unknown, metricPath: string): number | null {
  if (!isRecord(detail)) {
    return null;
  }

  const segments = metricPath.split(".");
  let current: unknown = detail;

  for (const segment of segments) {
    if (Array.isArray(current)) {
      const index = Number.parseInt(segment, 10);
      if (
        Number.isNaN(index) ||
        index < 0 ||
        index >= current.length ||
        current[index] === undefined
      ) {
        return null;
      }
      current = current[index];
      continue;
    }

    if (!isRecord(current) || !(segment in current)) {
      return null;
    }

    current = current[segment];
  }

  if (typeof current === "number" && Number.isFinite(current)) {
    return current;
  }

  return null;
}

function ScoreEvolutionChart({ sessions, gameId }: ScoreEvolutionChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>(DEFAULT_METRIC);

  const configuredMetricOptions = useMemo<MetricOption[]>(() => {
    if (!gameId) {
      return [];
    }
    const labelsForGame = SCORE_DETAIL_LABELS[gameId];
    if (!labelsForGame) {
      return [];
    }

    return Object.entries(labelsForGame).map(([value, label]) => ({
      value,
      label,
    }));
  }, [gameId]);

  const availableMetricOptions = useMemo<MetricOption[]>(() => {
    if (!configuredMetricOptions.length) {
      return [];
    }

    return configuredMetricOptions.filter((option) =>
      sessions.some((session) => {
        const detail = session.scoreDetail;
        if (!detail) {
          return false;
        }
        const thomasValue = getMetricValue(detail.thomas, option.value);
        const auroreValue = getMetricValue(detail.aurore, option.value);
        return thomasValue !== null && auroreValue !== null;
      })
    );
  }, [configuredMetricOptions, sessions]);

  useEffect(() => {
    if (
      selectedMetric !== DEFAULT_METRIC &&
      !availableMetricOptions.some((option) => option.value === selectedMetric)
    ) {
      setSelectedMetric(DEFAULT_METRIC);
    }
  }, [availableMetricOptions, selectedMetric]);

  const metricLabel = useMemo(() => {
    if (selectedMetric === DEFAULT_METRIC) {
      return "Score";
    }
    return (
      availableMetricOptions.find((option) => option.value === selectedMetric)
        ?.label ?? selectedMetric
    );
  }, [availableMetricOptions, selectedMetric]);

  const buildData = useCallback(
    (sortedSessions: GameSession[]): EvolutionDatum[] =>
      sortedSessions
        .filter((session) => session.date instanceof Date)
        .reduce<EvolutionDatum[]>((accumulator, session) => {
          if (selectedMetric === DEFAULT_METRIC) {
            if (
              Number.isFinite(session.scoreThomas) &&
              Number.isFinite(session.scoreAurore)
            ) {
              accumulator.push({
                id: session.id,
                date: session.date,
                thomasValue: session.scoreThomas,
                auroreValue: session.scoreAurore,
              });
            }
            return accumulator;
          }

          const detail = session.scoreDetail;
          if (!detail) {
            return accumulator;
          }

          const thomasValue = getMetricValue(detail.thomas, selectedMetric);
          const auroreValue = getMetricValue(detail.aurore, selectedMetric);

          if (thomasValue === null || auroreValue === null) {
            return accumulator;
          }

          accumulator.push({
            id: session.id,
            date: session.date,
            thomasValue,
            auroreValue,
          });

          return accumulator;
        }, []),
    [selectedMetric]
  );

  const tooltipFormatter = useCallback(
    (datum: EvolutionDatum, player: "Thomas" | "Aurore") => {
      const date = datum.date.toLocaleDateString("fr-FR");
      const primary =
        player === "Thomas" ? datum.thomasValue : datum.auroreValue;
      const secondary =
        player === "Thomas" ? datum.auroreValue : datum.thomasValue;
      return `${date} ${metricLabel}: ${primary} - ${secondary}`;
    },
    [metricLabel]
  );

  const hasMetricSelection = availableMetricOptions.length > 0;
  const controlIdPrefix = "score";

  return (
    <EvolutionChart
      sessions={sessions}
      buildData={buildData}
      tooltipFormatter={tooltipFormatter}
      ariaLabel="Score evolution chart"
      emptyMessage="Add sessions to see the score evolution."
      controlIdPrefix={controlIdPrefix}
      extraControls={
        hasMetricSelection ? (
          <>
            <label
              htmlFor={`${controlIdPrefix}-metric-filter`}
              className="sr-only"
            >
              Select score detail metric
            </label>
            <select
              id={`${controlIdPrefix}-metric-filter`}
              value={selectedMetric}
              onChange={(event) => setSelectedMetric(event.target.value)}
            >
              <option value={DEFAULT_METRIC}>Total score</option>
              {availableMetricOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        ) : null
      }
    />
  );
}

export default ScoreEvolutionChart;
