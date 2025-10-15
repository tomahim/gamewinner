import FirestoreData from "./FirestoreData";
import LogoutButton from "./LogoutButton";
import logo from "../assets/logo.jpg";

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
  const { image, alt, rank, name } = game;
  return (
    <div className="game-card">
      <img src={image} alt={alt} />
      <div className="rank-tag">{rank}</div>
      <div className="game-name">{name}</div>
    </div>
  );
}

function GamesList() {
  return (
    <>
      <header>
        {/* <div className="menu-icon material-icons">menu</div> */}
        <img alt="logo" src={logo} className="logo" />
        <h2>Game Winner</h2>
        <LogoutButton />
      </header>

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

      <div className="fab material-icons">add</div>

      <div className="bottom-nav">
        <div className="nav-item active material-icons">grid_view</div>
        <div className="nav-item material-icons">play_arrow</div>
        <div className="nav-item material-icons">people</div>
        <div className="nav-item material-icons">whatshot</div>
      </div>
    </>
  );
}

export default GamesList;
