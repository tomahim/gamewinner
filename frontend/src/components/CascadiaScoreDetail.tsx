import { useState } from "react";
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

function CascadiaScoreDetail() {
  const animals = [
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

  //   const [animalScoresThomas, set] = useState

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
            type="number"
            placeholder="Aurore"
          />
          <input
            className="col"
            title={a.name}
            type="number"
            placeholder="Thomas"
          />
        </div>
      ))}
      <div className="three-columns-icon text-center margin-bottom-10">
        <div className="icon">Animals</div>
        <div className="col">3</div>
        <div className="col">4</div>
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
            type="number"
            placeholder="Aur."
          />
          <input
            className="col-small"
            title={h.name}
            type="number"
            disabled={true}
          />
          <input
            className="col-big"
            title={h.name}
            type="number"
            placeholder="Tho."
          />
          <input
            className="col-small"
            title={h.name}
            type="number"
            disabled={true}
          />
        </div>
      ))}
      <div className="three-columns-icon text-center margin-bottom-10">
        <div className="icon">Habitats</div>
        <div className="col">3</div>
        <div className="col">4</div>
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
