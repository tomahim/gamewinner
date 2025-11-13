import { useEffect, useState } from "react";
import birdsIcon from "../assets/wingspan-images/birds.png";
import bonusCardsIcon from "../assets/wingspan-images/bonusCards.png";
import roundObjectivesIcon from "../assets/wingspan-images/roundObjectives.png";
import eggsIcon from "../assets/wingspan-images/eggs.png";
import storedFoodIcon from "../assets/wingspan-images/storedFood.png";
import coveredCardsIcon from "../assets/wingspan-images/coveredCards.png";
import {
  type Player,
  type WingspanPlayerScoreBreakdown,
  type WingspanScoreDetailData,
} from "../types/scoreDetail";

type WingspanScoreDetailProps = {
  initialScoreDetail?: WingspanScoreDetailData | null;
  onChange: (detail: WingspanScoreDetailData) => void;
};

const toNumber = (value: number | "") => (value === "" ? 0 : value);

const scoreItems: {
  name: string;
  icon: string;
}[] = [
  {
    name: "birds",
    icon: birdsIcon,
  },
  {
    name: "bonusCards",
    icon: bonusCardsIcon,
  },
  {
    name: "roundObjectives",
    icon: roundObjectivesIcon,
  },
  {
    name: "eggs",
    icon: eggsIcon,
  },
  {
    name: "storedFood",
    icon: storedFoodIcon,
  },
  {
    name: "coveredCards",
    icon: coveredCardsIcon,
  },
];

const createEmptyScores = () =>
  scoreItems.reduce((acc, a) => {
    acc[a.name] = "";
    return acc;
  }, {} as Record<string, number | "">);

const buildScoresFromDetail = (detail?: WingspanScoreDetailData | null) => {
  const base = {
    aurore: createEmptyScores(),
    thomas: createEmptyScores(),
  };

  if (!detail) {
    return base;
  }

  scoreItems.forEach(({ name }) => {
    // @ts-ignore
    const auroreValue = detail.aurore?.[name];
    // @ts-ignore
    const thomasValue = detail.thomas?.[name];

    if (typeof auroreValue === "number") {
      base.aurore[name] = auroreValue;
    }
    if (typeof thomasValue === "number") {
      base.thomas[name] = thomasValue;
    }
  });

  return base;
};

function WingspanScoreDetail({
  initialScoreDetail,
  onChange,
}: WingspanScoreDetailProps) {
  const [scores, setScores] = useState(() =>
    buildScoresFromDetail(initialScoreDetail)
  );

  useEffect(() => {
    setScores(buildScoresFromDetail(initialScoreDetail));
  }, [initialScoreDetail]);

  const totalScore = (player: Player) =>
    Object.values(scores[player]).reduce(
      (acc, current) => (acc as number) + toNumber(current),
      0
    );

  const handleScoreChange = (
    player: Player,
    animalName: string,
    rawValue: string
  ) => {
    const numericValue = rawValue === "" ? "" : Number(rawValue);

    setScores((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [animalName]: numericValue,
      },
    }));
  };

  useEffect(() => {
    const buildPlayerDetail = (
      player: Player
    ): WingspanPlayerScoreBreakdown => {
      const scoresData = scoreItems.reduce<Record<string, number>>(
        (acc, { name }) => {
          acc[name] = toNumber(scores[player][name]);
          return acc;
        },
        {}
      );

      const total = Object.values(scoresData).reduce(
        (sum, value) => sum + value,
        0
      );

      return {
        ...scoresData,
        total: total,
      } as WingspanPlayerScoreBreakdown;
    };

    const detail: WingspanScoreDetailData = {
      aurore: buildPlayerDetail("aurore"),
      thomas: buildPlayerDetail("thomas"),
    };

    onChange(detail);
  }, [scores, onChange]);
  return (
    <>
      {scoreItems.map((item) => (
        <div className="three-columns-icon" key={item.name}>
          <div className="icon">
            <div className="img-circle">
              <img alt={item.name} src={item.icon} />
            </div>
          </div>
          <input
            className="col"
            title={item.name}
            value={scores.aurore[item.name]}
            onChange={(e) =>
              handleScoreChange("aurore", item.name, e.target.value)
            }
            type="number"
            placeholder="Aurore"
          />
          <input
            className="col"
            title={item.name}
            value={scores.thomas[item.name]}
            onChange={(e) =>
              handleScoreChange("thomas", item.name, e.target.value)
            }
            type="number"
            placeholder="Thomas"
          />
        </div>
      ))}
      <div className="three-columns-icon text-center margin-bottom-10">
        <div className="icon">Total</div>
        <div className="col">{totalScore("aurore")}</div>
        <div className="col">{totalScore("thomas")}</div>
      </div>
    </>
  );
}

export default WingspanScoreDetail;
