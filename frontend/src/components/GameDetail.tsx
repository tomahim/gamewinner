import { useNavigate, useParams } from "react-router-dom";
import FooterNav from "./FooterNav";
import Header from "./Header";
import { useGamesList } from "../data/GamesListContext";
import Loader from "./ui/Loader";

function GameDetail() {
  const { games, loading } = useGamesList();
  const navigate = useNavigate();
  const { id } = useParams();
  const game = games.find((g) => g.id === id);

  if (loading) {
    return <Loader />;
  }

  if (!game) {
    return <>Game not found.</>;
  }

  const { imageUrl } = game;
  return (
    <>
      <Header title="Game" />

      <div className="game-picture">
        <img src={imageUrl} alt="game-picture" />
      </div>

      <div
        onClick={() => navigate(`/game/${id}/add-session`)}
        className="fab material-icons"
      >
        add
      </div>

      <FooterNav />
    </>
  );
}

export default GameDetail;
