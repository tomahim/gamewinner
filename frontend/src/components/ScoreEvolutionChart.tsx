import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import type { GameSession } from "../data/GamesListContext";
import "./ScoreEvolutionChart.scss";

type ScoreEvolutionChartProps = {
  sessions: GameSession[];
};

function ScoreEvolutionChart({ sessions }: ScoreEvolutionChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const years = useMemo(() => {
    const uniqueYears = new Set<number>();
    sessions.forEach((session) => {
      if (session.date instanceof Date) {
        uniqueYears.add(session.date.getFullYear());
      }
    });
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [sessions]);

  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [selectedPeriod, setSelectedPeriod] = useState<
    "none" | "first" | "last"
  >("none");

  useEffect(() => {
    if (selectedYear !== "all" && !years.includes(selectedYear)) {
      setSelectedYear("all");
    }
  }, [selectedYear, years]);

  useEffect(() => {
    setSelectedPeriod("none");
  }, [selectedYear]);

  const filteredSessions = useMemo(
    () =>
      selectedYear === "all"
        ? sessions
        : sessions.filter(
            (session) =>
              session.date instanceof Date &&
              session.date.getFullYear() === selectedYear
          ),
    [sessions, selectedYear]
  );

  const periodFilteredSessions = useMemo(() => {
    if (selectedYear === "all" || selectedPeriod === "none") {
      return filteredSessions;
    }

    return filteredSessions.filter((session) => {
      if (!(session.date instanceof Date)) {
        return false;
      }
      const month = session.date.getMonth();
      if (selectedPeriod === "first") {
        return month <= 5;
      }
      return month >= 6;
    });
  }, [filteredSessions, selectedPeriod, selectedYear]);

  const data = useMemo(
    () =>
      periodFilteredSessions
        .filter(
          (session) =>
            Number.isFinite(session.scoreThomas) &&
            Number.isFinite(session.scoreAurore)
        )
        .map((session) => ({
          id: session.id,
          date: session.date,
          scoreThomas: session.scoreThomas,
          scoreAurore: session.scoreAurore,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [periodFilteredSessions]
  );

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!data.length) {
      const div = tooltipRef.current;
      if (div) {
        div.style.display = "none";
      }
      return;
    }

    const width = 340;
    const height = 200;
    const margin = { top: 16, right: 20, bottom: 32, left: 36 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const chartArea = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const firstDate = data[0]?.date;
    const lastDate = data[data.length - 1]?.date;

    if (!firstDate || !lastDate) {
      return;
    }

    let minDate = firstDate;
    let maxDate = lastDate;

    if (firstDate.getTime() === lastDate.getTime()) {
      const msInDay = 24 * 60 * 60 * 1000;
      minDate = new Date(firstDate.getTime() - msInDay);
      maxDate = new Date(lastDate.getTime() + msInDay);
    }

    const monthStep = selectedYear === "all" ? 6 : 1;
    const tickInterval = d3.timeMonth.every(monthStep);
    const xTickValues: Date[] = [];

    const startingTick =
      tickInterval?.floor(minDate) ?? d3.timeMonth.floor(minDate);

    if (startingTick) {
      let tickCursor = new Date(startingTick.getTime());
      while (tickCursor <= maxDate) {
        xTickValues.push(new Date(tickCursor.getTime()));
        tickCursor = tickInterval
          ? tickInterval.offset(tickCursor, 1)
          : d3.timeMonth.offset(tickCursor, monthStep);
      }
    }

    if (!xTickValues.length) {
      xTickValues.push(new Date(minDate.getTime()));
    }

    const xScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([0, innerWidth]);

    const scores = data.flatMap((session) => [
      session.scoreThomas,
      session.scoreAurore,
    ]);

    const minScore = d3.min(scores) ?? 0;
    const maxScore = d3.max(scores) ?? 1;
    const padding = Math.max((maxScore - minScore) * 0.1, 5);

    const yScale = d3
      .scaleLinear()
      .domain([minScore - padding, maxScore + padding])
      .range([innerHeight, 0])
      .nice();

    const axisColor = "rgba(255, 255, 255, 0.35)";

    const tickFormat = selectedYear === "all" ? "%b %Y" : "%b";

    const xAxis = d3
      .axisBottom<Date>(xScale)
      .tickValues(xTickValues)
      .tickFormat((date) => d3.timeFormat(tickFormat)(date));

    chartArea
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((g) => {
        g.select(".domain").attr("stroke", axisColor);
        g.selectAll("line").attr("stroke", axisColor);
        g.selectAll("text").attr("fill", axisColor).style("font-size", "10px");
      });

    const yAxis = d3
      .axisLeft<number>(yScale)
      .ticks(4)
      .tickFormat((value) => value.toString());

    chartArea
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .call((g) => {
        g.select(".domain").attr("stroke", axisColor);
        g.selectAll("line").attr("stroke", axisColor);
        g.selectAll("text").attr("fill", axisColor).style("font-size", "10px");
      });

    const formatTooltip = (
      session: (typeof data)[number],
      player: "Thomas" | "Aurore"
    ) => {
      const date = session.date.toLocaleDateString("fr-FR");
      const scoreA =
        player === "Thomas" ? session.scoreThomas : session.scoreAurore;
      const scoreB =
        player === "Thomas" ? session.scoreAurore : session.scoreThomas;
      return `${date} ${scoreA} - ${scoreB}`;
    };

    const drawDots = (
      className: string,
      accessor: (session: (typeof data)[number]) => number,
      player: "Thomas" | "Aurore"
    ) => {
      chartArea
        .append("g")
        .selectAll(`circle.${className}`)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", `dot ${className}`)
        .attr("cx", (session) => xScale(session.date))
        .attr("cy", accessor)
        .attr("r", 3.5)
        .attr(
          "fill",
          className === "thomas"
            ? "rgba(255, 152, 0, 0.65)"
            : "rgba(116, 204, 255, 0.65)"
        )
        .attr(
          "stroke",
          className === "thomas"
            ? "rgba(255, 111, 0, 0.9)"
            : "rgba(77, 184, 255, 0.9)"
        )
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("click", (event, session) => {
          event.stopPropagation();

          const div = tooltipRef.current;
          if (!div) {
            return;
          }

          const svgElement = svgRef.current;
          if (!svgElement) {
            return;
          }

          const point = svgElement.createSVGPoint();
          point.x = xScale(session.date) + margin.left;
          point.y = accessor(session) + margin.top;

          const ctm = svgElement.getScreenCTM();
          if (!ctm) {
            return;
          }

          const screenPoint = point.matrixTransform(ctm);

          const x = screenPoint.x;
          const y = screenPoint.y;

          div.textContent = formatTooltip(session, player);
          div.style.display = "block";
          div.style.left = `${x}px`;
          div.style.top = `${y - 28}px`;
        });
    };

    drawDots("thomas", (session) => yScale(session.scoreThomas), "Thomas");
    drawDots("aurore", (session) => yScale(session.scoreAurore), "Aurore");

    chartArea
      .append("g")
      .attr("class", "grid")
      .selectAll("line.horizontal-grid")
      .data(yScale.ticks(4))
      .enter()
      .append("line")
      .attr("class", "horizontal-grid")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (tick) => yScale(tick))
      .attr("y2", (tick) => yScale(tick))
      .attr("stroke", "rgba(255, 255, 255, 0.15)")
      .attr("stroke-width", 0.5);

    const handleClickOutside = () => {
      const div = tooltipRef.current;
      if (div) {
        div.style.display = "none";
      }
    };

    const root = svgRef.current?.ownerDocument ?? document;

    root.addEventListener("click", handleClickOutside);

    return () => {
      root.removeEventListener("click", handleClickOutside);
    };
  }, [data]);

  return (
    <div className="score-evolution-chart">
      <div
        ref={tooltipRef}
        className="score-tooltip"
        role="status"
        aria-live="polite"
      />
      <div className="chart-controls">
        <label htmlFor="score-year-filter" className="sr-only">
          Filter sessions by year
        </label>
        <select
          id="score-year-filter"
          value={selectedYear}
          onChange={(event) => {
            const value = event.target.value;
            setSelectedYear(value === "all" ? "all" : parseInt(value, 10));
          }}
        >
          <option value="all">All years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {selectedYear !== "all" && (
          <>
            <label htmlFor="score-period-filter" className="sr-only">
              Filter sessions by semester
            </label>
            <select
              id="score-period-filter"
              value={selectedPeriod}
              onChange={(event) => {
                const value = event.target.value as "none" | "first" | "last";
                setSelectedPeriod(value);
              }}
            >
              <option value="none">Zoom on period</option>
              <option value="first">First 6 months</option>
              <option value="last">Last 6 months</option>
            </select>
          </>
        )}
      </div>

      {data.length === 0 ? (
        <div className="no-data">Add sessions to see the score evolution.</div>
      ) : (
        <>
          <svg
            ref={svgRef}
            className="chart"
            aria-label="Score evolution chart"
          />
          <div className="legend" aria-hidden>
            <div className="legend-item">
              <span className="legend-swatch thomas" />
              <span>Thomas</span>
            </div>
            <div className="legend-item">
              <span className="legend-swatch aurore" />
              <span>Aurore</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ScoreEvolutionChart;
