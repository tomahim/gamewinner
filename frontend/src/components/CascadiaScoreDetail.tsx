import { useEffect, useState } from "react";
import bearIcon from "../assets/cascadia-images/bear.png";
import wapitiIcon from "../assets/cascadia-images/wapiti.png";
import salmonIcon from "../assets/cascadia-images/salmon.png";
import foxIcon from "../assets/cascadia-images/fox.png";
import hawkIcon from "../assets/cascadia-images/hawk.png";
import mountainIcon from "../assets/cascadia-images/mountain.png";
import forestIcon from "../assets/cascadia-images/forest.png";
import dryMeadowIcon from "../assets/cascadia-images/dryMeadow.png";
import humidMeadowIcon from "../assets/cascadia-images/humidMeadow.png";
import waterIcon from "../assets/cascadia-images/water.png";
import landscapeIcon from "../assets/cascadia-images/landscapes.png";
import pineconeIcon from "../assets/cascadia-images/pinecone.png";
import {
  type CascadiaScoreDetailData,
  type Player,
} from "../types/scoreDetail";

type HabitatScore = {
  partial: number | "";
  bonus: number;
};

type CascadiaScoreDetailProps = {
  initialScoreDetail?: CascadiaScoreDetailData | null;
  onChange: (detail: CascadiaScoreDetailData) => void;
};

const toNumber = (value: number | "") => (value === "" ? 0 : value);

const animals: {
  name: string;
  icon: string;
}[] = [
  {
    name: "bear",
    icon: bearIcon,
  },
  {
    name: "wapiti",
    icon: wapitiIcon,
  },
  {
    name: "salmon",
    icon: salmonIcon,
  },
  {
    name: "hawk",
    icon: hawkIcon,
  },
  {
    name: "fox",
    icon: foxIcon,
  },
];

const habitats = [
  {
    name: "mountain",
    icon: mountainIcon,
  },
  {
    name: "forest",
    icon: forestIcon,
  },
  {
    name: "dryMeadow",
    icon: dryMeadowIcon,
  },
  {
    name: "humidMeadow",
    icon: humidMeadowIcon,
  },
  {
    name: "water",
    icon: waterIcon,
  },
];

const createEmptyAnimalScores = () =>
  animals.reduce((acc, a) => {
    acc[a.name] = "";
    return acc;
  }, {} as Record<string, number | "">);

const createEmptyHabitatScores = () =>
  habitats.reduce((acc, habitat) => {
    acc[habitat.name] = { partial: "", bonus: 0 };
    return acc;
  }, {} as Record<string, HabitatScore>);

const buildAnimalScoresFromDetail = (
  detail?: CascadiaScoreDetailData | null
) => {
  const base = {
    aurore: createEmptyAnimalScores(),
    thomas: createEmptyAnimalScores(),
  };

  if (!detail) {
    return base;
  }

  animals.forEach(({ name }) => {
    const auroreValue = detail.aurore?.animals?.[name];
    const thomasValue = detail.thomas?.animals?.[name];

    if (typeof auroreValue === "number") {
      base.aurore[name] = auroreValue;
    }
    if (typeof thomasValue === "number") {
      base.thomas[name] = thomasValue;
    }
  });

  return base;
};

const deriveHabitatFromTotals = (
  totalAurore?: number,
  totalThomas?: number
) => {
  const aurore: HabitatScore = { partial: "", bonus: 0 };
  const thomas: HabitatScore = { partial: "", bonus: 0 };

  const hasAurore =
    typeof totalAurore === "number" && !Number.isNaN(totalAurore);
  const hasThomas =
    typeof totalThomas === "number" && !Number.isNaN(totalThomas);

  if (!hasAurore && !hasThomas) {
    return { aurore, thomas };
  }

  const auroreValue = hasAurore ? totalAurore! : 0;
  const thomasValue = hasThomas ? totalThomas! : 0;

  if (hasAurore) {
    aurore.partial = auroreValue;
  }
  if (hasThomas) {
    thomas.partial = thomasValue;
  }

  if (hasAurore && hasThomas) {
    if (auroreValue === thomasValue) {
      const base = auroreValue - 1;
      if (base >= 0) {
        aurore.partial = base;
        thomas.partial = base;
        aurore.bonus = 1;
        thomas.bonus = 1;
      }
    } else if (auroreValue > thomasValue) {
      const base = auroreValue - 2;
      if (base >= 0 && base > toNumber(thomas.partial)) {
        aurore.partial = base;
        thomas.partial = thomasValue;
        aurore.bonus = 2;
        thomas.bonus = 0;
      }
    } else {
      const base = thomasValue - 2;
      if (base >= 0 && base > toNumber(aurore.partial)) {
        thomas.partial = base;
        aurore.partial = auroreValue;
        thomas.bonus = 2;
        aurore.bonus = 0;
      }
    }
  }

  return { aurore, thomas };
};

const buildHabitatScoresFromDetail = (
  detail?: CascadiaScoreDetailData | null
) => {
  const base = {
    aurore: createEmptyHabitatScores(),
    thomas: createEmptyHabitatScores(),
  };

  if (!detail) {
    return base;
  }

  habitats.forEach(({ name }) => {
    const totals = deriveHabitatFromTotals(
      detail.aurore?.habitats?.[name],
      detail.thomas?.habitats?.[name]
    );
    base.aurore[name] = totals.aurore;
    base.thomas[name] = totals.thomas;
  });

  return base;
};

function CascadiaScoreDetail({
  initialScoreDetail,
  onChange,
}: CascadiaScoreDetailProps) {
  const [animalScores, setAnimalScores] = useState(() =>
    buildAnimalScoresFromDetail(initialScoreDetail)
  );

  const [habitatScores, setHabitatScores] = useState(() =>
    buildHabitatScoresFromDetail(initialScoreDetail)
  );

  const [pineconeScores, setPineconeScores] = useState<
    Record<Player, number | "">
  >(() => ({
    aurore: initialScoreDetail?.aurore?.pinecone ?? "",
    thomas: initialScoreDetail?.thomas?.pinecone ?? "",
  }));

  const [landscapeScores, setLandscapeScores] = useState<
    Record<Player, number | "">
  >(() => ({
    aurore: initialScoreDetail?.aurore?.landscape ?? "",
    thomas: initialScoreDetail?.thomas?.landscape ?? "",
  }));

  useEffect(() => {
    setAnimalScores(buildAnimalScoresFromDetail(initialScoreDetail));
    setHabitatScores(buildHabitatScoresFromDetail(initialScoreDetail));
    setPineconeScores({
      aurore: initialScoreDetail?.aurore?.pinecone ?? "",
      thomas: initialScoreDetail?.thomas?.pinecone ?? "",
    });
    setLandscapeScores({
      aurore: initialScoreDetail?.aurore?.landscape ?? "",
      thomas: initialScoreDetail?.thomas?.landscape ?? "",
    });
  }, [initialScoreDetail]);

  const totalAnimals = (player: Player) =>
    Object.values(animalScores[player]).reduce(
      (acc, current) => (acc as number) + toNumber(current),
      0
    );

  const totalHabitats = (player: Player) =>
    habitats.reduce((acc, { name }) => {
      const score = habitatScores[player][name];
      return acc + toNumber(score.partial) + score.bonus;
    }, 0);

  const totalScore = (player: Player) =>
    (((totalAnimals(player) as number) + totalHabitats(player)) as number) +
    toNumber(pineconeScores[player]) +
    toNumber(landscapeScores[player]);

  const handleAnimalScoreChange = (
    player: Player,
    animalName: string,
    rawValue: string
  ) => {
    const numericValue = rawValue === "" ? "" : Number(rawValue);

    setAnimalScores((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [animalName]: numericValue,
      },
    }));
  };

  const handleHabitatScoreChange = (
    player: Player,
    habitatName: string,
    rawValue: string
  ) => {
    const numericValue = rawValue === "" ? "" : Number(rawValue);

    setHabitatScores((prev) => {
      const auroreScores = {
        ...prev.aurore,
        [habitatName]: { ...prev.aurore[habitatName] },
      };
      const thomasScores = {
        ...prev.thomas,
        [habitatName]: { ...prev.thomas[habitatName] },
      };

      const updated = { aurore: auroreScores, thomas: thomasScores };
      updated[player][habitatName].partial = numericValue;

      const aurorePartial = updated.aurore[habitatName].partial;
      const thomasPartial = updated.thomas[habitatName].partial;
      const auroreHasValue = aurorePartial !== "";
      const thomasHasValue = thomasPartial !== "";

      let auroreBonus = 0;
      let thomasBonus = 0;

      if (auroreHasValue || thomasHasValue) {
        const auroreValue = toNumber(aurorePartial);
        const thomasValue = toNumber(thomasPartial);

        if (auroreHasValue && thomasHasValue && auroreValue === thomasValue) {
          auroreBonus = 1;
          thomasBonus = 1;
        } else if (auroreValue > thomasValue) {
          auroreBonus = 2;
          thomasBonus = 0;
        } else if (thomasValue > auroreValue) {
          auroreBonus = 0;
          thomasBonus = 2;
        }
      }

      updated.aurore[habitatName].bonus = auroreBonus;
      updated.thomas[habitatName].bonus = thomasBonus;

      return updated;
    });
  };

  const handlePineconeScoreChange = (player: Player, rawValue: string) => {
    const numericValue = rawValue === "" ? "" : Number(rawValue);
    setPineconeScores((prev) => ({
      ...prev,
      [player]: numericValue,
    }));
  };

  const handleLandscapeScoreChange = (player: Player, rawValue: string) => {
    const numericValue = rawValue === "" ? "" : Number(rawValue);
    setLandscapeScores((prev) => ({
      ...prev,
      [player]: numericValue,
    }));
  };

  useEffect(() => {
    const buildPlayerDetail = (player: Player) => {
      const animalBreakdown = animals.reduce<Record<string, number>>(
        (acc, { name }) => {
          acc[name] = toNumber(animalScores[player][name]);
          return acc;
        },
        {}
      );

      const habitatBreakdown = habitats.reduce<Record<string, number>>(
        (acc, { name }) => {
          const score = habitatScores[player][name];
          acc[name] = toNumber(score.partial) + score.bonus;
          return acc;
        },
        {}
      );

      const totalAnimalsScore = Object.values(animalBreakdown).reduce(
        (sum, value) => sum + value,
        0
      );
      const totalHabitatsScore = Object.values(habitatBreakdown).reduce(
        (sum, value) => sum + value,
        0
      );
      const pinecone = toNumber(pineconeScores[player]);
      const landscape = toNumber(landscapeScores[player]);
      const total =
        totalAnimalsScore + totalHabitatsScore + pinecone + landscape;

      return {
        animals: animalBreakdown,
        habitats: habitatBreakdown,
        landscape,
        pinecone,
        total,
      };
    };

    const detail: CascadiaScoreDetailData = {
      aurore: buildPlayerDetail("aurore"),
      thomas: buildPlayerDetail("thomas"),
    };

    onChange(detail);
  }, [animalScores, habitatScores, pineconeScores, landscapeScores, onChange]);
  return (
    <>
      {animals.map((animal) => (
        <div className="three-columns-icon" key={animal.name}>
          <div className="icon">
            <div className="img-circle">
              <img alt={animal.name} src={animal.icon} />
            </div>
          </div>
          <input
            className="col"
            title={animal.name}
            value={animalScores.aurore[animal.name]}
            onChange={(e) =>
              handleAnimalScoreChange("aurore", animal.name, e.target.value)
            }
            type="number"
            placeholder="Aurore"
          />
          <input
            className="col"
            title={animal.name}
            value={animalScores.thomas[animal.name]}
            onChange={(e) =>
              handleAnimalScoreChange("thomas", animal.name, e.target.value)
            }
            type="number"
            placeholder="Thomas"
          />
        </div>
      ))}
      <div className="three-columns-icon text-center margin-bottom-10">
        <div className="icon">Animals</div>
        <div className="col">{totalAnimals("aurore")}</div>
        <div className="col">{totalAnimals("thomas")}</div>
      </div>

      {habitats.map((habitat) => (
        <div className="five-columns-icon" key={habitat.name}>
          <div className="icon">
            <div className="img-circle">
              <img alt={habitat.name} src={habitat.icon} />
            </div>
          </div>
          <input
            className="col-big"
            title={habitat.name}
            value={habitatScores.aurore[habitat.name].partial}
            onChange={(e) =>
              handleHabitatScoreChange("aurore", habitat.name, e.target.value)
            }
            type="number"
            placeholder="Aur."
          />
          <div>{habitatScores.aurore[habitat.name].bonus}</div>
          <input
            className="col-big"
            title={habitat.name}
            value={habitatScores.thomas[habitat.name].partial}
            onChange={(e) =>
              handleHabitatScoreChange("thomas", habitat.name, e.target.value)
            }
            type="number"
            placeholder="Tho."
          />
          <div>{habitatScores.thomas[habitat.name].bonus}</div>
        </div>
      ))}
      <div className="three-columns-icon text-center margin-bottom-10">
        <div className="icon">Habitats</div>
        <div className="col">{totalHabitats("aurore")}</div>
        <div className="col">{totalHabitats("thomas")}</div>
      </div>
      <div className="three-columns-icon">
        <div className="icon">
          <div className="img-circle">
            <img alt="pinecone Icon" src={pineconeIcon} />
          </div>
        </div>
        <input
          className="col"
          title="Pinecone"
          type="number"
          value={pineconeScores.aurore}
          onChange={(e) => handlePineconeScoreChange("aurore", e.target.value)}
          placeholder="Aurore"
        />
        <input
          className="col"
          title="Pinecone"
          type="number"
          value={pineconeScores.thomas}
          onChange={(e) => handlePineconeScoreChange("thomas", e.target.value)}
          placeholder="Thomas"
        />
      </div>
      <div className="three-columns-icon">
        <div className="icon">
          <div className="img-circle">
            <img alt="Landscape Icon" src={landscapeIcon} />
          </div>
        </div>
        <input
          className="col"
          title="Landscape"
          type="number"
          value={landscapeScores.aurore}
          onChange={(e) => handleLandscapeScoreChange("aurore", e.target.value)}
          placeholder="Aurore"
        />
        <input
          className="col"
          title="Landscape"
          type="number"
          value={landscapeScores.thomas}
          onChange={(e) => handleLandscapeScoreChange("thomas", e.target.value)}
          placeholder="Thomas"
        />
      </div>
      <div className="three-columns-icon text-center margin-bottom-10">
        <div className="icon">Total</div>
        <div className="col">{totalScore("aurore")}</div>
        <div className="col">{totalScore("thomas")}</div>
      </div>
    </>
  );
}

export default CascadiaScoreDetail;
