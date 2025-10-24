import {
  useMonthStatsFromParams,
  useOverallStats,
  useYearStatsFromParams,
  useYearsWithStats,
} from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import Loader from "./ui/Loader";
import "./StatsByPeriod.scss";
import PlayCountPodium from "./PlayCountPodium";
import TopTenList from "./TopTenList";
import SummaryStats from "./SummaryStats";
import { useTopPlayCounts } from "../data/useTopPlayCounts";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import noTimeToPlay from "../assets/notimetoplay.jpg";
import { getMonthName } from "./MonthHistory";

function getMonthNumber(monthName: string) {
  if (monthName === "") {
    return "";
  }
  const date = new Date(`${monthName} 1, 2023`);
  return date.getMonth(); // Returns 0 (January) to 11 (December)
}

function usePeriodSelection() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState<"" | number>("");
  const [selectedMonth, setSelectedMonth] = useState<"" | number>("");

  useEffect(() => {
    if (selectedYear !== "") {
      if (selectedMonth !== "") {
        navigate("/stats/" + selectedYear + "/" + selectedMonth);
      } else {
        navigate("/stats/" + selectedYear);
      }
    } else {
      navigate("/stats");
    }
  }, [selectedYear, selectedMonth, navigate]);

  const { year, month } = useParams();
  useEffect(() => {
    if (year != null) {
      setSelectedYear(parseInt(year));
      if (month != null) {
        setSelectedMonth(parseInt(month));
      }
    } else {
      setSelectedMonth("");
    }
  }, [year, month]);

  return { selectedYear, selectedMonth, setSelectedMonth, setSelectedYear };
}

function usePageTitleFromParams() {
  const { year, month } = useParams();
  const monthDefined = month != null && month !== "";
  if (!year && !monthDefined) {
    return "Overall stats";
  }

  if (year && !monthDefined) {
    return year + " stats";
  }

  if (year && monthDefined) {
    return (
      getMonthName(parseInt(month as unknown as string)) + " " + year + " stats"
    );
  }
}

function StatsByPeriod() {
  const { overallStats, loading } = useOverallStats();
  const { yearStats } = useYearStatsFromParams();
  const { monthStats } = useMonthStatsFromParams();
  const pageTitle = usePageTitleFromParams();

  const { years } = useYearsWithStats();
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } =
    usePeriodSelection();

  const {
    topThree: topThreeOverall,
    remainingTopTen: remainingTopTenOverall,
    countRange: countRangeOverall,
  } = useTopPlayCounts(overallStats ?? null);

  const {
    topThree: topThreeYear,
    remainingTopTen: remainingTopTenYear,
    countRange: countRangeYear,
  } = useTopPlayCounts(yearStats ?? null);

  const {
    topThree: topThreeMonth,
    remainingTopTen: remainingTopTenMonth,
    countRange: countRangeMonth,
  } = useTopPlayCounts(monthStats ?? null);

  const definedMonth = selectedMonth != null && selectedMonth !== "";

  const topThree = definedMonth
    ? topThreeMonth
    : selectedYear
    ? topThreeYear
    : topThreeOverall;
  const remainingTopTen = definedMonth
    ? remainingTopTenMonth
    : selectedYear
    ? remainingTopTenYear
    : remainingTopTenOverall;
  const countRange = definedMonth
    ? countRangeMonth
    : selectedYear
    ? countRangeYear
    : countRangeOverall;
  const aggregatedStats = definedMonth
    ? monthStats
    : selectedYear
    ? yearStats
    : overallStats;

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("en-US", { month: "long" })
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header title={pageTitle} />
      <main className="stats-page margin-bottom-80">
        <div className="select-container">
          <select
            name="year"
            title="Year"
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                e.target.value === "" ? "" : parseInt(e.target.value)
              )
            }
          >
            <option value="">All years</option>
            {years.length &&
              years.map((year) => <option value={year}>{year}</option>)}
          </select>
          <select
            name="month"
            title="Month"
            value={selectedMonth}
            disabled={!selectedYear}
            onChange={(e) =>
              setSelectedMonth(
                e.target.value === "" ? "" : parseInt(e.target.value)
              )
            }
          >
            <option value="">All months</option>
            {months.length &&
              months.map((month) => (
                <option value={getMonthNumber(month)}>{month}</option>
              ))}
          </select>
        </div>

        {!aggregatedStats ? (
          <div className="no-data-container">
            <img
              src={noTimeToPlay}
              alt="No game found"
              className="no-data-image"
            />
          </div>
        ) : (
          <SummaryStats aggregatedStats={aggregatedStats} />
        )}

        {topThree.length > 0 && <PlayCountPodium topThree={topThree} />}

        {remainingTopTen.length > 0 && (
          <TopTenList
            title="Other games played"
            items={remainingTopTen}
            startingRank={4}
            countRange={countRange}
          />
        )}
      </main>
      <FooterNav />
    </>
  );
}

export default StatsByPeriod;
