import { useMemo, useState } from "react";
import Header from "./Header";
import FooterNav from "./FooterNav";
import { useGamesList, useYearsWithStats } from "../data/GamesListContext";
import {
  generateMockBadges,
  type BadgePlayer,
  type MockBadge,
  getBadgeTypeLabel,
  type BadgeType,
} from "../data/mockBadges";
import { useNavigate } from "react-router-dom";
import "./Badges.scss";

const tabs: { id: BadgePlayer; label: string; icon: string }[] = [
  { id: "my", label: "My badges", icon: "emoji_events" },
  { id: "opponent", label: "Opponent badges", icon: "sports_kabaddi" },
];

const badgeTypeOptions: { label: string; value: "all" | BadgeType }[] = [
  { label: "All badge types", value: "all" },
  { label: "Streak", value: "streak" },
  { label: "Game streak", value: "game-streak" },
  { label: "Lifetime wins", value: "milestone" },
];

function isBadgeNew(badge: MockBadge) {
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
  return badge.earnedDateISO.some((iso) => new Date(iso) >= fifteenDaysAgo);
}

function BadgeCard({ badge, onClick }: { badge: MockBadge; onClick: () => void }) {
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
        <span className={`badge-card__rarity badge-card__rarity--${badge.rarity}`}>
          {badge.rarity}
        </span>
      </div>
      <div className="badge-card__media">
        {badge.game?.imageUrl && (
          <img src={badge.game.imageUrl} alt={badge.title} />
        )}
        <span className="badge-card__type">{getBadgeTypeLabel(badge.type)}</span>
      </div>
      <div className="badge-card__body">
        <h3 className="badge-card__title">{badge.title}</h3>
        <p className="badge-card__subtitle">{badge.subtitle}</p>
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
  const { years } = useYearsWithStats();
  const { games } = useGamesList();
  const [activeTab, setActiveTab] = useState<BadgePlayer>("my");
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");
  const [selectedType, setSelectedType] = useState<"all" | BadgeType>("all");

  const collections = useMemo(
    () => generateMockBadges(years, games),
    [years, games]
  );

  const yearsToDisplay = useMemo(() => collections.yearsUsed, [collections]);

  const allBadgesForCount = useMemo(() => {
    return yearsToDisplay.reduce((sum, year) => {
      const schedule = collections.byYear[year];
      if (!schedule) return sum;
      return sum + schedule.my.length + schedule.opponent.length;
    }, 0);
  }, [collections, yearsToDisplay]);

  const totalXp = useMemo(() => {
    return yearsToDisplay.reduce((sum, year) => {
      const schedule = collections.byYear[year];
      if (!schedule) return sum;
      return (
        sum + schedule.my.reduce((acc, badge) => acc + badge.xpValue, 0) +
        schedule.opponent.reduce((acc, badge) => acc + badge.xpValue, 0)
      );
    }, 0);
  }, [collections, yearsToDisplay]);

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
    const result: Array<{ year: number; badges: MockBadge[] }> = [];

    filteredYears.forEach((year) => {
      const schedule = collections.byYear[year];
      if (!schedule) return;

      let badges = schedule[activeTab];

      if (selectedMonth !== "all") {
        badges = badges.filter((badge) =>
          badge.earnedDateISO.some((iso) => new Date(iso).getMonth() === selectedMonth)
        );
      }

      if (selectedType !== "all") {
        badges = badges.filter((badge) => badge.type === selectedType);
      }

      if (badges.length > 0) {
        result.push({ year, badges });
      }
    });

    return result;
  }, [filteredYears, collections, activeTab, selectedMonth, selectedType]);

  return (
    <>
      <Header title="Badges" />
      <main className="badges-page margin-bottom-80">
        <section className="badges-summary">
          <div className="badges-summary__totals">
            <div className="badges-summary__metric">
              <span className="badges-summary__label">Total XP</span>
              <span className="badges-summary__value">{totalXp.toLocaleString()}</span>
            </div>
            <div className="badges-summary__metric">
              <span className="badges-summary__label">Badges unlocked</span>
              <span className="badges-summary__value">{allBadgesForCount}</span>
            </div>
          </div>
        </section>

        <section className="badges-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              className={`badges-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="material-icons">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </section>

        <section className="badges-filters">
          <select
            title="Year"
            value={selectedYear}
            onChange={(event) =>
              setSelectedYear(
                event.target.value === "all" ? "all" : parseInt(event.target.value, 10)
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
                event.target.value === "all" ? "all" : parseInt(event.target.value, 10)
              )
            }
          >
            {monthsOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            title="Badge type"
            value={selectedType}
            onChange={(event) =>
              setSelectedType(event.target.value as "all" | BadgeType)
            }
          >
            {badgeTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </section>

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
                    onClick={() => navigate(`/badge/${encodeURIComponent(badge.id)}`)}
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

