import { useMemo, useState } from "react";
import Header from "./Header";
import FooterNav from "./FooterNav";
import { useGamesList, useYearsWithStats } from "../data/GamesListContext";
import {
  type BadgePlayer,
  type BaseBadge,
  type BadgeComputationContext,
} from "../data/badges.types";
import { computeBadges } from "../data/badges.compute";
import { getBadgeTypeLabel } from "../data/badges.helpers";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Badges.scss";
import ImageCircle from "./ui/ImageCircle";

const tabs: { id: BadgePlayer; label: string; icon: "Thomas" | "Aurore" }[] = [
  { id: "my", label: "Thomas", icon: "Thomas" },
  { id: "opponent", label: "Aurore", icon: "Aurore" },
];

const badgeTypeOptions = [
  { label: "All badge types", value: "all" },
  { label: "Streak", value: "streak" },
  { label: "Game streak", value: "game-streak" },
  { label: "Lifetime wins", value: "milestone" },
];

function isBadgeNew(badge: BaseBadge) {
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
  return badge.earnedDateISO.some((iso) => new Date(iso) >= fifteenDaysAgo);
}

function BadgeCard({
  badge,
  onClick,
}: {
  badge: BaseBadge;
  onClick: () => void;
}) {
  const newBadge = isBadgeNew(badge);

  return (
    <article
      className={`badge-card ${newBadge ? "badge-card--new" : ""}`}
      style={{ background: badge.gradient, color: badge.textColor }}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {newBadge && <span className="badge-card__new-pill">NEW</span>}
      <div className="badge-card__header">
        <span className="badge-card__tier">{badge.tierLabel}</span>
        <span
          className={`badge-card__rarity badge-card__rarity--${badge.rarity}`}
        >
          {badge.rarity}
        </span>
      </div>
      <div className="badge-card__media">
        {badge.type === "streak" ? (
          <div className="badge-card__streak-emblem">
            <span className="material-icons trophy">emoji_events</span>
            <span className="streak-multiplier">
              {badge.tierLabel.replace(/[^0-9]/g, "")}
              <span className="suffix">x</span>
            </span>
          </div>
        ) : (
          badge.game?.imageUrl && (
            <img src={badge.game.imageUrl} alt={badge.title} />
          )
        )}
        <span className="badge-card__type">
          {getBadgeTypeLabel(badge.type)}
        </span>
      </div>
      <div className="badge-card__body">
        <h3 className="badge-card__title">{badge.title}</h3>
        <div className="badge-card__footer">
          <span className="badge-card__xp">{badge.xpValue} XP</span>
          <span className="badge-card__earnings">
            {badge.earnedLabels.length > 1
              ? `${badge.earnedLabels.length} unlocks`
              : badge.earnedLabels[0]}
          </span>
        </div>
      </div>
    </article>
  );
}

function Badges() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { years } = useYearsWithStats();
  const { games } = useGamesList();
  const sessions = useMemo(() => {
    return games.flatMap((game) => game.sessions ?? []);
  }, [games]);
  const computationContext: BadgeComputationContext = useMemo(
    () => ({ games, sessions, years }),
    [games, sessions, years]
  );
  const collections = useMemo(
    () => computeBadges(computationContext),
    [computationContext]
  );
  const initialTab = searchParams.get("tab") === "opponent" ? "opponent" : "my";
  const [activeTab, setActiveTab] = useState<BadgePlayer>(initialTab);
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [gameQuery, setGameQuery] = useState<string>("");

  const yearsToDisplay = useMemo(() => collections.yearsUsed, [collections]);

  const gameOptions = useMemo(() => {
    const uniqueGames = new Map<string, string>();
    games.forEach((game) => {
      if (game.id) {
        uniqueGames.set(game.id, game.name);
      }
    });
    return Array.from(uniqueGames.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [games]);

  const handleGameSelection = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === "all games") {
      setSelectedGame("all");
      setGameQuery("");
      return;
    }
    const match = gameOptions.find(
      (option) => option.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (match) {
      setSelectedGame(match.id);
      setGameQuery(match.name);
    } else {
      setSelectedGame("all");
      setGameQuery(trimmed);
    }
  };

  const tabTotals = useMemo(() => {
    const totals: Record<BadgePlayer, { xp: number; count: number }> = {
      my: { xp: 0, count: 0 },
      opponent: { xp: 0, count: 0 },
    };

    collections.yearsUsed.forEach((year) => {
      const schedule = collections.byYear[year];
      if (!schedule) return;
      totals.my.count += schedule.my.length;
      totals.opponent.count += schedule.opponent.length;
      totals.my.xp += schedule.my.reduce(
        (sum, badge) => sum + badge.xpValue,
        0
      );
      totals.opponent.xp += schedule.opponent.reduce(
        (sum, badge) => sum + badge.xpValue,
        0
      );
    });

    return totals;
  }, [collections]);

  const activeTotals = tabTotals[activeTab];

  const monthsOptions = useMemo(() => {
    return [
      { label: "All months", value: "all" as const },
      ...Array.from({ length: 12 }, (_, index) => {
        const date = new Date(2025, index, 1);
        return {
          label: date.toLocaleString("en", { month: "long" }),
          value: index,
        };
      }),
    ];
  }, []);

  const filteredYears = useMemo(() => {
    if (selectedYear === "all") {
      return yearsToDisplay;
    }
    return yearsToDisplay.filter((year) => year === selectedYear);
  }, [yearsToDisplay, selectedYear]);

  const badgesByYear = useMemo(() => {
    const result: Array<{ year: number; badges: BaseBadge[] }> = [];

    filteredYears.forEach((year) => {
      const schedule = collections.byYear[year];
      if (!schedule) return;

      let badges = schedule[activeTab];

      if (selectedMonth !== "all") {
        badges = badges.filter((badge) =>
          badge.earnedDateISO.some(
            (iso) => new Date(iso).getMonth() === selectedMonth
          )
        );
      }

      if (selectedType !== "all") {
        badges = badges.filter((badge) => badge.type === selectedType);
      }

      if (selectedGame !== "all") {
        badges = badges.filter((badge) => badge.game?.id === selectedGame);
      }

      badges = [...badges].sort((a, b) => {
        const dateA = Math.max(
          ...a.earnedDateISO.map((iso) => new Date(iso).getTime())
        );
        const dateB = Math.max(
          ...b.earnedDateISO.map((iso) => new Date(iso).getTime())
        );
        return dateB - dateA;
      });

      if (badges.length > 0) {
        result.push({ year, badges });
      }
    });

    return result;
  }, [
    filteredYears,
    collections,
    activeTab,
    selectedMonth,
    selectedType,
    selectedGame,
  ]);

  return (
    <>
      <Header title="Badges" />
      <main className="badges-page margin-bottom-80">
        <section className="badges-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              className={`badges-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                const nextParams = new URLSearchParams(searchParams);
                nextParams.set("tab", tab.id);
                setSearchParams(nextParams);
              }}
            >
              <ImageCircle player={tab.icon} />
              {tab.label}
            </button>
          ))}
        </section>

        <section className="badges-summary">
          <div className="badges-summary__totals">
            <div className="badges-summary__metric">
              <span className="badges-summary__label">Total XP</span>
              <span className="badges-summary__value">
                {activeTotals.xp.toLocaleString()}
              </span>
            </div>
            <div className="badges-summary__metric">
              <span className="badges-summary__label">Badges unlocked</span>
              <span className="badges-summary__value">
                {activeTotals.count}
              </span>
            </div>
          </div>
        </section>

        <section className="badges-filters badges-filters--two-column">
          <div className="badges-filters__column">
            <select
              title="Year"
              value={selectedYear}
              onChange={(event) =>
                setSelectedYear(
                  event.target.value === "all"
                    ? "all"
                    : parseInt(event.target.value, 10)
                )
              }
            >
              <option value="all">All years</option>
              {yearsToDisplay.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              title="Month"
              value={selectedMonth}
              onChange={(event) =>
                setSelectedMonth(
                  event.target.value === "all"
                    ? "all"
                    : parseInt(event.target.value, 10)
                )
              }
              disabled={selectedYear === "all"}
            >
              {monthsOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="badges-filters__column badges-filters__column--horizontal">
            <select
              title="Badge type"
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              {badgeTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="badges-filters__autocomplete">
              <input
                type="text"
                placeholder="Filter by game"
                value={gameQuery}
                onChange={(event) => handleGameSelection(event.target.value)}
                list="badges-games"
              />
              <datalist id="badges-games">
                <option value="" disabled />
                <option value="All games" />
                {gameOptions.map((game) => (
                  <option key={game.id} value={game.name} />
                ))}
              </datalist>
              {selectedGame !== "all" && (
                <button
                  className="badges-filters__clear"
                  onClick={() => handleGameSelection("")}
                >
                  <span className="material-icons">close</span>
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="badges-guide-link">
          <button
            className="badges-guide-link__button"
            onClick={() => navigate("/badges/info")}
          >
            <span className="material-icons">info</span>
            Guide
          </button>
        </div>

        <section className="badges-timeline">
          {badgesByYear.map(({ year, badges }) => (
            <div className="badges-year-block" key={year}>
              <div className="badges-year-heading">
                <span className="badges-year-marker">{year}</span>
                <div className="badges-year-divider">
                  <span className="badges-year-dot" />
                  <span className="badges-year-line" />
                </div>
              </div>

              <div className="badges-grid">
                {badges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    onClick={() =>
                      navigate(`/badge/${encodeURIComponent(badge.id)}`)
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
      <FooterNav />
    </>
  );
}

export default Badges;
