import { useGamesList, type Game } from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import Loader from "./ui/Loader";

function GameCard({ game }: { game: Game }) {
  const navigate = useNavigate();
  const { id, imageUrl, name, sessions } = game;
  return (
    <div onClick={() => navigate(`/game/${id}`)} className="game-card">
      <img src={imageUrl} alt="game" />
      <div className="rank-tag">
        {sessions?.length ?? 0} play{sessions?.length > 1 ? "s" : ""}
      </div>
      <div className="game-name">{name}</div>
    </div>
  );
}

function GamesList() {
  const { games, loading } = useGamesList();

  const sortedGames = games.slice().sort((a, b) => {
    return (b.sessions?.length ?? 0) - (a.sessions?.length ?? 0);
  });

  const navigate = useNavigate();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header isHome={true} />

      <h2 className="section-title">Our games ({games.length})</h2>

      <div className="game-grid">
        {sortedGames.map((game) => (
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
