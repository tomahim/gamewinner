import FirestoreData from "./FirestoreData";
import FooterNav from "./FooterNav";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

// TODO: Sample game data (replace with data from FirestoreData)
const games = [
  {
    id: 1,
    image:
      "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__itemrep/img/DR7181wU4sHT6gn6Q1XccpPxNHg=/fit-in/246x300/filters:strip_icc()/pic4458123.jpg",
    alt: "Wingspan",
    rank: "#38",
    name: "Wingspan",
  },
  {
    id: 2,
    image:
      "https://cf.geekdo-images.com/MjeJZfulbsM1DSV3DrGJYA__imagepage/img/0ksox22FKLq-Z-rsbBlF2IDG9x0=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5100691.jpg",
    alt: "Cascadia",
    rank: "#54",
    name: "Cascadia",
  },
];

function GameCard(
  // @ts-ignore
  { game }
) {
  const navigate = useNavigate();
  const { image, alt, rank, name } = game;
  return (
    <div onClick={() => navigate("/game")} className="game-card">
      <img src={image} alt={alt} />
      <div className="rank-tag">{rank}</div>
      <div className="game-name">{name}</div>
    </div>
  );
}

function GamesList() {
  const navigate = useNavigate();

  return (
    <>
      <Header isHome={true} />
      <div className="section-separator">
        Current month score: Aurore: 5 - Thomas: 6
      </div>

      <section className="section-title">Games ({games.length})</section>

      <FirestoreData />

      {/* Single game-grid with map */}
      <div className="game-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <div className="game-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <div className="game-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <div onClick={() => navigate("/add-game")} className="fab material-icons">
        add
      </div>

      <FooterNav />
    </>
  );
}

export default GamesList;
