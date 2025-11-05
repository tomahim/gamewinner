import { useCallback } from "react";
import type { GameSession } from "../data/GamesListContext";
import EvolutionChart, { type EvolutionDatum } from "./EvolutionChart";

type WinsEvolutionChartProps = {
  sessions: GameSession[];
};

function WinsEvolutionChart({ sessions }: WinsEvolutionChartProps) {
  const buildData = useCallback(
    (sortedSessions: GameSession[]): EvolutionDatum[] => {
      let thomasWins = 0;
      let auroreWins = 0;

      return sortedSessions.map((session) => {
        if (session.winner === "Thomas") {
          thomasWins += 1;
        } else if (session.winner === "Aurore") {
          auroreWins += 1;
        }

        return {
          id: session.id,
          date: session.date,
          thomasValue: thomasWins,
          auroreValue: auroreWins,
        };
      });
    },
    []
  );

  const tooltipFormatter = useCallback(
    (datum: EvolutionDatum, player: "Thomas" | "Aurore") => {
      const date = datum.date.toLocaleDateString("fr-FR");
      const primary =
        player === "Thomas" ? datum.thomasValue : datum.auroreValue;
      const secondary =
        player === "Thomas" ? datum.auroreValue : datum.thomasValue;
      return `${date} ${primary} - ${secondary} wins`;
    },
    []
  );

  const yTickFormat = useCallback(
    (value: number) => Math.max(0, Math.round(value)).toString(),
    []
  );

  return (
    <EvolutionChart
      sessions={sessions}
      buildData={buildData}
      tooltipFormatter={tooltipFormatter}
      ariaLabel="Wins evolution chart"
      emptyMessage="Add sessions to see the wins evolution."
      yTickFormat={yTickFormat}
      controlIdPrefix="wins"
    />
  );
}

export default WinsEvolutionChart;
