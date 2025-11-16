import { useMemo } from "react";
import { type GameSession } from "../data/GamesListContext";
import {
  type CascadiaScoreDetailData,
  type Player,
} from "../types/scoreDetail";
import bearIcon from "../assets/cascadia-images/bear.png";
import wapitiIcon from "../assets/cascadia-images/wapiti.png";
import salmonIcon from "../assets/cascadia-images/salmon.png";
import foxIcon from "../assets/cascadia-images/fox.png";
import hawkIcon from "../assets/cascadia-images/hawk.png";
import "./CascadiaAnimalsTotals.scss";

type AnimalKey = "bear" | "wapiti" | "salmon" | "hawk" | "fox";

type AnimalDefinition = {
  key: AnimalKey;
  label: string;
  icon: string;
};

const ANIMALS: AnimalDefinition[] = [
  { key: "bear", label: "Bear", icon: bearIcon },
  { key: "wapiti", label: "Wapiti", icon: wapitiIcon },
  { key: "salmon", label: "Salmon", icon: salmonIcon },
  { key: "hawk", label: "Hawk", icon: hawkIcon },
  { key: "fox", label: "Fox", icon: foxIcon },
];

const isCascadiaScoreDetail = (
  detail: GameSession["scoreDetail"]
): detail is CascadiaScoreDetailData => {
  if (!detail || typeof detail !== "object") {
    return false;
  }

  const casted = detail as CascadiaScoreDetailData;
  const auroreAnimals = casted.aurore?.animals;
  const thomasAnimals = casted.thomas?.animals;

  return (
    !!auroreAnimals &&
    !!thomasAnimals &&
    typeof auroreAnimals === "object" &&
    typeof thomasAnimals === "object"
  );
};

type CascadiaAnimalsTotalsProps = {
  sessions: GameSession[];
  player: Player;
  className?: string;
};

type AnimalWithTotal = AnimalDefinition & { total: number; average: number };

const formatPoints = (value: number) =>
  Number.isFinite(value)
    ? (Math.round(value * 10) / 10).toString()
    : "0";

const CascadiaAnimalsTotals = ({
  sessions,
  player,
  className,
}: CascadiaAnimalsTotalsProps) => {
  const sessionsWithDetailCount = useMemo(
    () =>
      sessions.reduce(
        (count, session) =>
          count + (isCascadiaScoreDetail(session.scoreDetail) ? 1 : 0),
        0
      ),
    [sessions]
  );

  const animalTotals: AnimalWithTotal[] = useMemo(() => {
    const gamesCount = sessionsWithDetailCount;
    return ANIMALS.map((animal) => {
      const total = sessions.reduce((sum, session) => {
        if (!isCascadiaScoreDetail(session.scoreDetail)) {
          return sum;
        }

        const value = session.scoreDetail[player]?.animals?.[animal.key];
        return sum + (typeof value === "number" && !Number.isNaN(value) ? value : 0);
      }, 0);

      const average =
        gamesCount > 0 ? total / gamesCount : 0;

      return { ...animal, total, average };
    })
      .sort((a, b) => b.total - a.total);
  }, [sessions, player, sessionsWithDetailCount]);

  const totalAnimalsScore = useMemo(
    () => animalTotals.reduce((sum, animal) => sum + animal.total, 0),
    [animalTotals]
  );

  const averageAnimalsScore = useMemo(() => {
    return sessionsWithDetailCount > 0
      ? totalAnimalsScore / sessionsWithDetailCount
      : 0;
  }, [totalAnimalsScore, sessionsWithDetailCount]);

  const wrapperClassName = ["cascadia-animals-totals", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      <div className="cascadia-animals-total-label">
        Animals total{" "}
        <span className="cascadia-animals-total-value">
          {totalAnimalsScore} pts
        </span>
        <span className="cascadia-animals-total-average">
          Avg {formatPoints(averageAnimalsScore)} pts/game
        </span>
      </div>
      <div className="cascadia-animals-grid">
        {animalTotals.map((animal) => (
          <div className="cascadia-animals-item" key={animal.key}>
            <div className="img-circle">
              <img src={animal.icon} alt={`${animal.label} icon`} />
            </div>
            <span className="cascadia-animals-item-label">{animal.label}</span>
            <span className="cascadia-animals-item-score">
              {animal.total} pts
            </span>
            <span className="cascadia-animals-item-average">
              Avg {formatPoints(animal.average)} pts/game
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CascadiaAnimalsTotals;
