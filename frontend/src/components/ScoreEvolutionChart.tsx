import { useCallback } from "react";
import type { GameSession } from "../data/GamesListContext";
import EvolutionChart, { type EvolutionDatum } from "./EvolutionChart";

type ScoreEvolutionChartProps = {
  sessions: GameSession[];
};

function ScoreEvolutionChart({ sessions }: ScoreEvolutionChartProps) {
  const buildData = useCallback(
    (sortedSessions: GameSession[]): EvolutionDatum[] =>
      sortedSessions
        .filter(
          (session) =>
            Number.isFinite(session.scoreThomas) &&
            Number.isFinite(session.scoreAurore)
        )
        .map((session) => ({
          id: session.id,
          date: session.date,
          thomasValue: session.scoreThomas,
          auroreValue: session.scoreAurore,
        })),
    []
  );

  const tooltipFormatter = useCallback(
    (datum: EvolutionDatum, player: "Thomas" | "Aurore") => {
      const date = datum.date.toLocaleDateString("fr-FR");
      const primary =
        player === "Thomas" ? datum.thomasValue : datum.auroreValue;
      const secondary =
        player === "Thomas" ? datum.auroreValue : datum.thomasValue;
      return `${date} ${primary} - ${secondary}`;
    },
    []
  );

  return (
    <EvolutionChart
      sessions={sessions}
      buildData={buildData}
      tooltipFormatter={tooltipFormatter}
      ariaLabel="Score evolution chart"
      emptyMessage="Add sessions to see the score evolution."
      controlIdPrefix="score"
    />
  );
}

export default ScoreEvolutionChart;
