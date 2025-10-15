import FirestoreData from "./FirestoreData";
import LogoutButton from "./LogoutButton";

// Sample game data (replace with data from FirestoreData)
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

// Optional: Create a GameCard component for reusability
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
  // If FirestoreData provides the games array, you can replace the static `games` with it
  // e.g., const games = useContext(FirestoreContext) or passed as props from FirestoreData

  return (
    <>
      <header>
        <div className="menu-icon material-icons">menu</div>
        <h1>Game Winner</h1>
        <LogoutButton />
      </header>

      <div className="tabs">
        <div className="tab active">Games</div>
        <div className="tab">Stats</div>
        <div className="tab">History</div>
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
