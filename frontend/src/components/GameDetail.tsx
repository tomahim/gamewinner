import { useNavigate } from "react-router-dom";
import FooterNav from "./FooterNav";
import Header from "./Header";
import { useGameFromParams } from "../data/GamesListContext";
import Loader from "./ui/Loader";
import PlayingCardIcon from "./ui/PlayingCardIcon";
import SessionCard from "./SessionCard";

const LIMIT_PLAYS = 10;

function GameDetail() {
  const navigate = useNavigate();

  const { game, id, loading, refresh } = useGameFromParams();

  if (loading) return <Loader />;

  if (!game) {
    return <>Game not found.</>;
  }

  const { imageUrl, stats } = game;
  const { totalPlays, thomasWins, auroreWins } = stats;
  return (
    <>
      <Header title={game.name} />

      <div className="game-picture">
        <img src={imageUrl} alt="game-picture" />
        <div className="stat-box-container relative-bottom">
          <div className="stat-box">
            <span className="number">{totalPlays}</span>
            <span className="text">Total</span>
          </div>
          <div className="stat-box">
            <div className="image-circle absolute-top">
              <img
                src="https://t4.ftcdn.net/jpg/12/42/71/23/360_F_1242712312_rKSLexYtzbBcMVhVjUSP4MMxuHq6xgmu.jpg"
                alt="Icon"
              />
            </div>
            <span className="number-bottom">{auroreWins}</span>
          </div>
          <div className="stat-box">
            <div className="image-circle absolute-top">
              <img
                src="https://www.bornfree.org.uk/wp-content/uploads/2023/10/Baby-elephant-c-Diana-Robinson-Getty-Images-1292x1081.jpg"
                alt="Icon"
              />
            </div>
            <span className="number-bottom">{thomasWins}</span>
          </div>
        </div>
      </div>

      <h2>Last plays</h2>

      {game.sessions.slice(0, LIMIT_PLAYS).map((session) => (
        <SessionCard session={session} refresh={refresh} />
      ))}

      <div onClick={() => navigate(`/game/${id}/add-session`)} className="fab">
        <PlayingCardIcon />
      </div>

      <h2>Scores Aurore</h2>

      <div className="stat-box-container centered">
        <div className="stat-box">
          <span className="number">{stats.scoreStatsAurore.mean}</span>
          <span className="text">Mean</span>
        </div>
        <div className="stat-box">
          <span className="number">{stats.scoreStatsAurore.highest}</span>
          <span className="text">Highest</span>
        </div>
        <div className="stat-box">
          <span className="number">{stats.scoreStatsAurore.lowest}</span>
          <span className="text">Lowest</span>
        </div>
        <div className="stat-box">
          <span className="number">
            {stats.scoreStatsAurore.percentageVictories}%
          </span>
          <span className="text">Wins</span>
        </div>
      </div>

      <h2>Scores Thomas</h2>

      <div className="stat-box-container centered margin-bottom-80">
        <div className="stat-box">
          <span className="number">{stats.scoreStatsThomas.mean}</span>
          <span className="text">Mean</span>
        </div>
        <div className="stat-box">
          <span className="number">{stats.scoreStatsThomas.highest}</span>
          <span className="text">Highest</span>
        </div>
        <div className="stat-box">
          <span className="number">{stats.scoreStatsThomas.lowest}</span>
          <span className="text">Lowest</span>
        </div>
        <div className="stat-box">
          <span className="number">
            {stats.scoreStatsThomas.percentageVictories}%
          </span>
          <span className="text">Wins</span>
        </div>
      </div>

      <FooterNav />
    </>
  );
}

export default GameDetail;
