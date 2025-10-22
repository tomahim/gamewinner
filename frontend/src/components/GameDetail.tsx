import { useNavigate } from "react-router-dom";
import FooterNav from "./FooterNav";
import Header from "./Header";
import { useGameFromParams } from "../data/GamesListContext";
import Loader from "./ui/Loader";
import PLayingCardIcon from "./ui/PlayingCardIcon";
import SessionCard from "./SessionCard";

function GameDetail() {
  const navigate = useNavigate();

  const { game, id, loading, refresh } = useGameFromParams();

  if (loading) return <Loader />;

  if (!game) {
    return <>Game not found.</>;
  }

  const { imageUrl } = game;
  return (
    <>
      <Header title={game.name} />

      <div className="game-picture">
        <img src={imageUrl} alt="game-picture" />
      </div>

      {game.sessions.map((session) => (
        <SessionCard session={session} refresh={refresh} />
      ))}

      <div onClick={() => navigate(`/game/${id}/add-session`)} className="fab">
        <PLayingCardIcon />
      </div>

      <FooterNav />
    </>
  );
}

export default GameDetail;
