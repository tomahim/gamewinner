import { useMemo, useState } from "react";
import Header from "./Header";
import FooterNav from "./FooterNav";
import { useGamesList, useYearsWithStats } from "../data/GamesListContext";
import {
  generateMockBadges,
  type BadgePlayer,
  type MockBadge,
  getBadgeTypeLabel,
} from "../data/mockBadges";
import { useNavigate } from "react-router-dom";
import "./Badges.scss";

const tabs: { id: BadgePlayer; label: string; icon: string }[] = [
  { id: "my", label: "My badges", icon: "emoji_events" },
  { id: "opponent", label: "Opponent badges", icon: "sports_kabaddi" },
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

  const collections = useMemo(
    () => generateMockBadges(years, games),
    [years, games]
  );

  const yearsToDisplay = useMemo(() => collections.yearsUsed, [collections]);

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

  return (
    <>
      <Header title="Badges" />
      <main className="badges-page margin-bottom-80">
        <section className="badges-summary">
          <div className="badges-summary__xp">
            <span className="badges-summary__label">Total XP</span>
            <span className="badges-summary__value">{totalXp.toLocaleString()}</span>
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

        <section className="badges-timeline">
          {yearsToDisplay.map((year) => {
            const schedule = collections.byYear[year];
            const badges = schedule?.[activeTab] ?? [];
            if (!badges.length) {
              return null;
            }

            return (
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
            );
          })}
        </section>
      </main>
      <FooterNav />
    </>
  );
}

export default Badges;

