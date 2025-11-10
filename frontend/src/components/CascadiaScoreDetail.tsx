import { useEffect, useRef, useState } from "react";
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

type HabitatScore = {
  partial: number | "";
  bonus: number;
};

function CascadiaScoreDetail() {
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

  const initialScores = animals.reduce((acc, a) => {
    acc[a.name] = "";
    return acc;
  }, {} as Record<string, number | "">);

  const [animalScores, setAnimalScores] = useState({
    aurore: initialScores,
    thomas: initialScores,
  });

  const initialHabitatScores = habitats.reduce((acc, a) => {
    acc[a.name] = { partial: "", bonus: 0 };
    return acc;
  }, {} as Record<string, HabitatScore>);

  const [habitatScores, setHabitatScores] = useState({
    aurore: initialHabitatScores,
    thomas: initialHabitatScores,
  });

  const totalAnimals = (player: "aurore" | "thomas") =>
    Object.values(animalScores[player]).reduce(
      (acc: number | "", i: number | "") =>
        (acc === "" ? 0 : acc) + (i === "" ? 0 : i)
    );
  const totalHabitats = (player: "aurore" | "thomas"): number => {
    return Object.values(habitatScores[player]).reduce((total, score) => {
      const partial = score.partial === "" ? 0 : score.partial;
      const bonus = score.bonus;
      return total + partial + bonus;
    }, 0);
  };

  const handleAnimalScoreChange = (
    player: "aurore" | "thomas",
    animalName: string,
    rawValue: string
  ) => {
    // Convert empty string to null, otherwise to number
    const numericValue = rawValue === "" ? null : Number(rawValue);
    setAnimalScores((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [animalName]: numericValue,
      },
    }));
  };

  const handleHabitatScoreChange = (
    player: "aurore" | "thomas",
    habitatName: string,
    rawValue: string
  ) => {
    // Convert empty string to null, otherwise to number
    const numericValue = rawValue === "" ? null : Number(rawValue);
    setHabitatScores((prev) => {
      const otherPlayer = player === "aurore" ? "thomas" : "aurore";
      const otherPlayerPartial =
        prev[otherPlayer][habitatName].partial === ""
          ? 0
          : prev[otherPlayer][habitatName].partial;

      console.log("otherPlayerPartial", otherPlayerPartial);

      let bonus = 0;
      if (numericValue !== null) {
        bonus =
          numericValue > otherPlayerPartial
            ? 2
            : otherPlayerPartial === numericValue
            ? 1
            : 0;
      }

      let otherPlayerBonus = 0;
      if (otherPlayerPartial !== null && numericValue !== null) {
        otherPlayerBonus =
          numericValue > otherPlayerPartial
            ? 0
            : otherPlayerPartial === numericValue
            ? 1
            : 2;
      }

      return {
        ...prev,
        [player]: {
          ...prev[player],
          [habitatName]: {
            partial: numericValue,
            bonus,
          },
        },
        [otherPlayer]: {
          ...prev[otherPlayer],
          [habitatName]: {
            bonus: otherPlayerBonus,
          },
        },
      };
    });
  };

  return (
    <>
      {animals.map((a) => (
        <div className="three-columns-icon">
          <div className="icon">
            <div className="img-circle">
              <img alt={a.name} src={a.icon} />
            </div>
          </div>
          <input
            className="col"
            title={a.name}
            value={animalScores.aurore[a.name]}
            onChange={(e) =>
              handleAnimalScoreChange("aurore", a.name, e.target.value)
            }
            type="number"
            placeholder="Aurore"
          />
          <input
            className="col"
            title={a.name}
            value={animalScores.thomas[a.name]}
            onChange={(e) =>
              handleAnimalScoreChange("thomas", a.name, e.target.value)
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

      {habitats.map((h) => (
        <div className="five-columns-icon">
          <div className="icon">
            <div className="img-circle">
              <img alt={h.name} src={h.icon} />
            </div>
          </div>
          <input
            className="col-big"
            title={h.name}
            value={habitatScores.aurore[h.name].partial}
            onChange={(e) =>
              handleHabitatScoreChange("aurore", h.name, e.target.value)
            }
            type="number"
            placeholder="Aur."
          />
          <div>{habitatScores.aurore[h.name].bonus}</div>
          <input
            className="col-big"
            title={h.name}
            value={habitatScores.thomas[h.name].partial}
            onChange={(e) =>
              handleHabitatScoreChange("thomas", h.name, e.target.value)
            }
            type="number"
            placeholder="Tho."
          />
          <div>{habitatScores.thomas[h.name].bonus}</div>
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
          placeholder="Aurore"
        />
        <input
          className="col"
          title="Pinecone"
          type="number"
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
          placeholder="Aurore"
        />
        <input
          className="col"
          title="Landscape"
          type="number"
          placeholder="Thomas"
        />
      </div>
    </>
  );
}

export default CascadiaScoreDetail;
