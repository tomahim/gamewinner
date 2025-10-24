import { useNavigate } from "react-router-dom";
import Header from "./Header";
import FooterNav from "./FooterNav";
import { badgeConfig } from "../data/badges.config";
import "./BadgeInfos.scss";

const sections = [
  {
    key: "streak",
    title: "Streak badges",
    description:
      "Earned by chaining consecutive wins across all games. If you reach multiple thresholds within one run, you keep only the highest-tier streak badge.",
    tiers: badgeConfig.streak.map((tier) => ({
      label: `${tier.length} wins in a row`,
      xp: tier.xp,
    })),
    icon: "emoji_events",
  },
  {
    key: "game-streak",
    title: "Game streak badges",
    description:
      "Awarded when you dominate a specific game with consecutive victories. Each game tracks its own best streak tier.",
    tiers: badgeConfig.gameStreak.map((tier) => ({
      label: `${tier.length} wins on a single game`,
      xp: tier.xp,
    })),
    icon: "sports_esports",
  },
  {
    key: "milestone",
    title: "Lifetime milestone badges",
    description:
      "Collected by accumulating total wins on a game over time. You can unlock every milestone as you continue playing.",
    tiers: badgeConfig.milestone.map((tier) => ({
      label: `${tier.wins} total wins`,
      xp: tier.xp,
    })),
    icon: "military_tech",
  },
];

function BadgeInfos() {
  const navigate = useNavigate();

  return (
    <>
      <Header title="Badge types" />
      <main className="badge-infos-page margin-bottom-80">
        <section className="badge-infos-hero">
          <div className="badge-infos-hero__content">
            <h1>Collect them all</h1>
            <p>
              Every match can unlock new rewards. Discover how streak, game streak,
              and lifetime milestone badges work – and how much XP each tier brings.
            </p>
            <button
              className="badge-infos-hero__button"
              onClick={() => navigate("/badges")}
            >
              <span className="material-icons">arrow_back</span>
              Back to badges
            </button>
          </div>
          <div className="badge-infos-hero__emblem">
            <span className="material-icons">stars</span>
          </div>
        </section>

        <section className="badge-infos-grid">
          {sections.map((section) => (
            <article className="badge-info-card" key={section.key}>
              <div className="badge-info-card__icon">
                <span className="material-icons">{section.icon}</span>
              </div>
              <div className="badge-info-card__heading">
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>
              <ul className="badge-info-card__tiers">
                {section.tiers.map((tier) => (
                  <li key={tier.label}>
                    <span className="tier-label">{tier.label}</span>
                    <span className="tier-xp">{tier.xp} XP</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
      <FooterNav />
    </>
  );
}

export default BadgeInfos;
