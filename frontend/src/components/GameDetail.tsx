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
        <div className="stat-box-container">
          <div className="stat-box">
            <span className="number">9</span>
            <span className="text">Total</span>
          </div>
          <div className="stat-box">
            <div className="image-circle">
              <img
                src="https://t4.ftcdn.net/jpg/12/42/71/23/360_F_1242712312_rKSLexYtzbBcMVhVjUSP4MMxuHq6xgmu.jpg"
                alt="Icon"
              />
            </div>
            <span className="number-bottom">5</span>
          </div>
          <div className="stat-box">
            <div className="image-circle">
              <img
                src="https://www.bornfree.org.uk/wp-content/uploads/2023/10/Baby-elephant-c-Diana-Robinson-Getty-Images-1292x1081.jpg"
                alt="Icon"
              />
            </div>
            <span className="number-bottom">4</span>
          </div>
        </div>
      </div>

      <h2>Last plays</h2>

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
