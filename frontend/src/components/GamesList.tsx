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
      <div className="rank-tag">{sessions?.length ?? 0} games</div>
      <div className="game-name">{name}</div>
    </div>
  );
}

function GamesList() {
  const { games, loading } = useGamesList();

  const navigate = useNavigate();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header isHome={true} />

      <div className="section-separator">October: Aurore 5 / Thomas 6</div>

      <h2 className="section-title">Collection ({games.length})</h2>

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
