import { useParams } from "react-router-dom";
import FooterNav from "./FooterNav";
import Header from "./Header";
import { useGamesList } from "../data/GamesListContext";

function GameDetail() {
  const { games } = useGamesList();
  const { id } = useParams();
  const game = games.find((g) => g.id === id);

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

      <FooterNav />
    </>
  );
}

export default GameDetail;
