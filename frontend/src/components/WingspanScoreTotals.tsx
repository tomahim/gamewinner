import { useMemo } from "react";
import { type GameSession } from "../data/GamesListContext";
import {
  type Player,
  type WingspanScoreDetailData,
} from "../types/scoreDetail";
import birdsIcon from "../assets/wingspan-images/birds.png";
import bonusCardsIcon from "../assets/wingspan-images/bonusCards.png";
import roundObjectivesIcon from "../assets/wingspan-images/roundObjectives.png";
import eggsIcon from "../assets/wingspan-images/eggs.png";
import storedFoodIcon from "../assets/wingspan-images/storedFood.png";
import coveredCardsIcon from "../assets/wingspan-images/coveredCards.png";
import "./WingspanScoreTotals.scss";

type ScoreKey =
  | "birds"
  | "bonusCards"
  | "roundObjectives"
  | "eggs"
  | "storedFood"
  | "coveredCards";

type ScoreDefinition = {
  key: ScoreKey;
  label: string;
  icon: string;
};

const SCORE_ITEMS: ScoreDefinition[] = [
  { key: "birds", label: "Birds", icon: birdsIcon },
  { key: "bonusCards", label: "Bonus cards", icon: bonusCardsIcon },
  { key: "roundObjectives", label: "Round objectives", icon: roundObjectivesIcon },
  { key: "eggs", label: "Eggs", icon: eggsIcon },
  { key: "storedFood", label: "Stored food", icon: storedFoodIcon },
  { key: "coveredCards", label: "Covered cards", icon: coveredCardsIcon },
];

const isWingspanScoreDetail = (
  detail: GameSession["scoreDetail"]
): detail is WingspanScoreDetailData => {
  if (!detail || typeof detail !== "object") {
    return false;
  }

  const casted = detail as WingspanScoreDetailData;
  const auroreDetail = casted.aurore;
  const thomasDetail = casted.thomas;

  return Boolean(auroreDetail && thomasDetail);
};

type WingspanScoreTotalsProps = {
  sessions: GameSession[];
  player: Player;
  className?: string;
};

type ScoreItemWithTotal = ScoreDefinition & { total: number; average: number };

const formatPoints = (value: number) =>
  Number.isFinite(value)
    ? (Math.round(value * 10) / 10).toString()
    : "0";

const WingspanScoreTotals = ({
  sessions,
  player,
  className,
}: WingspanScoreTotalsProps) => {
  const sessionsWithDetailCount = useMemo(
    () =>
      sessions.reduce(
        (count, session) =>
          count + (isWingspanScoreDetail(session.scoreDetail) ? 1 : 0),
        0
      ),
    [sessions]
  );

  const scoreTotals: ScoreItemWithTotal[] = useMemo(() => {
    const gamesCount = sessionsWithDetailCount;
    return SCORE_ITEMS.map((item) => {
      const total = sessions.reduce((sum, session) => {
        if (!isWingspanScoreDetail(session.scoreDetail)) {
          return sum;
        }

        const value = session.scoreDetail[player]?.[item.key];
        return sum + (typeof value === "number" && !Number.isNaN(value) ? value : 0);
      }, 0);

      const average =
        gamesCount > 0 ? total / gamesCount : 0;

      return { ...item, total, average };
    }).sort((a, b) => b.total - a.total);
  }, [sessions, player, sessionsWithDetailCount]);

  const overallTotal = useMemo(
    () => scoreTotals.reduce((sum, item) => sum + item.total, 0),
    [scoreTotals]
  );

  const overallAverage = useMemo(
    () =>
      sessionsWithDetailCount > 0
        ? overallTotal / sessionsWithDetailCount
        : 0,
    [overallTotal, sessionsWithDetailCount]
  );

  const wrapperClassName = ["wingspan-score-totals", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      <div className="wingspan-score-total-label">
        Total score{" "}
        <span className="wingspan-score-total-value">{overallTotal} pts</span>
        <span className="wingspan-score-total-average">
          Avg {formatPoints(overallAverage)} pts/game
        </span>
      </div>
      <div className="wingspan-score-grid">
        {scoreTotals.map((item) => (
          <div className="wingspan-score-item" key={item.key}>
            <div className="img-circle">
              <img src={item.icon} alt={`${item.label} icon`} />
            </div>
            <span className="wingspan-score-item-label">{item.label}</span>
            <span className="wingspan-score-item-score">{item.total} pts</span>
            <span className="wingspan-score-item-average">
              Avg {formatPoints(item.average)} pts/game
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WingspanScoreTotals;
