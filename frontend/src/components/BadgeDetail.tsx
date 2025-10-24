import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import FooterNav from "./FooterNav";
import { useGamesList, useYearsWithStats } from "../data/GamesListContext";
import {
  generateMockBadges,
  getMockBadgeById,
  getBadgeTypeLabel,
} from "../data/mockBadges";
import "./BadgeDetail.scss";

function BadgeDetail() {
  const navigate = useNavigate();
  const { badgeId } = useParams<{ badgeId: string }>();
  const { years } = useYearsWithStats();
  const { games } = useGamesList();

  const mockCollections = useMemo(
    () => generateMockBadges(years, games),
    [years, games]
  );

  const badge = badgeId
    ? getMockBadgeById(mockCollections, decodeURIComponent(badgeId))
    : undefined;

  if (!badge) {
    return (
      <>
        <Header title="Badge not found" />
        <main className="badge-detail-page">
          Could not locate this badge. Please go back.
        </main>
        <FooterNav />
      </>
    );
  }

  return (
    <>
      <Header title={badge.title} />
      <main className="badge-detail-page margin-bottom-80">
        <section className="badge-detail-card" style={{ background: badge.gradient, color: badge.textColor }}>
          <div className="badge-detail-card__media">
            {badge.game?.imageUrl && (
              <img src={badge.game.imageUrl} alt={badge.title} />
            )}
          </div>
          <div className="badge-detail-card__labels">
            <span className="badge-detail-card__tier">{badge.tierLabel}</span>
            <span className={`badge-detail-card__rarity badge-detail-card__rarity--${badge.rarity}`}>
              {badge.rarity}
            </span>
            <span className="badge-detail-card__type">{getBadgeTypeLabel(badge.type)}</span>
          </div>
          <h1 className="badge-detail-card__title">{badge.title}</h1>
          <p className="badge-detail-card__subtitle">{badge.subtitle}</p>
          <p className="badge-detail-card__description">{badge.description}</p>

          <div className="badge-detail-card__stats">
            <div className="badge-stat">
              <span className="badge-stat__label">XP value</span>
              <span className="badge-stat__value">{badge.xpValue}</span>
            </div>
            <div className="badge-stat">
              <span className="badge-stat__label">Earned</span>
              <span className="badge-stat__value">
                {badge.earnedLabels.length > 1
                  ? `${badge.earnedLabels.length} times`
                  : badge.earnedLabels[0]}
              </span>
            </div>
            {badge.milestoneCount != null && (
              <div className="badge-stat">
                <span className="badge-stat__label">Milestone</span>
                <span className="badge-stat__value">{badge.milestoneCount} wins</span>
              </div>
            )}
          </div>
        </section>

        {badge.streaks && badge.streaks.length > 0 && (
          <section className="badge-streaks">
            <h2>Streak timeline</h2>
            <div className="badge-streaks__list">
              {badge.streaks.map((streak) => (
                <article className="badge-streak" key={streak.id}>
                  <div className="badge-streak__dates">
                    <span className="badge-streak__label">Start</span>
                    <span className="badge-streak__value">{streak.startLabel}</span>
                  </div>
                  <div className="badge-streak__length">
                    <span className="badge-streak__value">{streak.length}</span>
                    <span className="badge-streak__label">wins</span>
                  </div>
                  <div className="badge-streak__dates">
                    <span className="badge-streak__label">End</span>
                    <span className="badge-streak__value">{streak.endLabel}</span>
                  </div>
                  {streak.highlight && (
                    <p className="badge-streak__highlight">{streak.highlight}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="badge-actions">
          <button className="badge-actions__button" onClick={() => navigate(-1)}>
            <span className="material-icons">arrow_back</span>
            Back to badges
          </button>
        </section>
      </main>
      <FooterNav />
    </>
  );
}

export default BadgeDetail;

