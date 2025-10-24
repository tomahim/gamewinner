import { useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import FooterNav from "./FooterNav";
import { useGamesList, useYearsWithStats } from "../data/GamesListContext";
import {
  computeBadges,
  type BadgeComputationContext,
} from "../data/badges.compute";
import { getBadgeTypeLabel } from "../data/badges.helpers";
import "./BadgeDetail.scss";

function BadgeDetail() {
  const navigate = useNavigate();
  const { badgeId } = useParams<{ badgeId: string }>();
  const { years } = useYearsWithStats();
  const { games } = useGamesList();

  const sessions = useMemo(() => {
    return games.flatMap((game) => game.sessions ?? []);
  }, [games]);

  const collections = useMemo(() => {
    const context: BadgeComputationContext = {
      games,
      sessions,
      years,
    };
    return computeBadges(context);
  }, [games, sessions, years]);

  const badge = badgeId
    ? collections.allBadges[decodeURIComponent(badgeId)]
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

  const goToMonth = useCallback(
    (iso: string) => {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return;
      const year = date.getFullYear();
      const month = date.getMonth();
      navigate(`/history/${year}/${month}`);
    },
    [navigate]
  );

  return (
    <>
      <Header title={badge.title} />
      <main className="badge-detail-page margin-bottom-80">
        <section
          className="badge-detail-card"
          style={{ background: badge.gradient, color: badge.textColor }}
        >
          <div className="badge-detail-card__media">
            {badge.type === "streak" ? (
              <div className="badge-detail-card__streak-emblem">
                <span className="material-icons badge-detail-card__trophy">
                  emoji_events
                </span>
                <span className="badge-detail-card__streak-value">
                  {badge.tierLabel.replace(/[^0-9]/g, "")}
                  <span className="suffix">x</span>
                </span>
              </div>
            ) : (
              badge.game?.imageUrl && (
                <img src={badge.game.imageUrl} alt={badge.title} />
              )
            )}
          </div>
          <div className="badge-detail-card__labels">
            <span className="badge-detail-card__tier">{badge.tierLabel}</span>
            <span
              className={`badge-detail-card__rarity badge-detail-card__rarity--${badge.rarity}`}
            >
              {badge.rarity}
            </span>
            <span className="badge-detail-card__type">
              {getBadgeTypeLabel(badge.type)}
            </span>
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
                <span className="badge-stat__value">
                  {badge.milestoneCount} wins
                </span>
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
                    <span className="badge-streak__value">
                      {streak.startLabel}
                    </span>
                  </div>
                  <div className="badge-streak__length">
                    <span className="badge-streak__value">{streak.length}</span>
                    <span className="badge-streak__label">wins</span>
                  </div>
                  <div className="badge-streak__dates">
                    <span className="badge-streak__label">End</span>
                    <div className="badge-streak__end-row">
                      <button
                        className="badge-streak__history"
                        onClick={() => goToMonth(streak.endISO)}
                      >
                        <span className="material-icons">calendar_today</span>
                      </button>
                      <span className="badge-streak__value badge-streak__value--end">
                        {streak.endLabel}
                      </span>
                    </div>
                  </div>
                  {streak.highlight && (
                    <p className="badge-streak__highlight">
                      {streak.highlight}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="badge-actions">
          <button
            className="badge-actions__button"
            onClick={() => navigate(-1)}
          >
            <span className="material-icons">arrow_back</span>
            Back to badges
          </button>
          {badge.game?.id && (
            <button
              className="badge-actions__button badge-actions__button--secondary"
              onClick={() => navigate(`/game/${badge.game?.id}`)}
            >
              <span className="material-icons">sports_esports</span>
              Go to game
            </button>
          )}
        </section>
      </main>
      <FooterNav />
    </>
  );
}

export default BadgeDetail;
