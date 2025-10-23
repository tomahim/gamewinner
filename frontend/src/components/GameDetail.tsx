import { useNavigate } from "react-router-dom";
import FooterNav from "./FooterNav";
import Header from "./Header";
import { useGameFromParams } from "../data/GamesListContext";
import Loader from "./ui/Loader";
import PlayingCardIcon from "./ui/PlayingCardIcon";
import SessionCard from "./SessionCard";
import StatBox from "./ui/StatBox";

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
          <StatBox value={totalPlays} label="Total" />
          <StatBox
            value={auroreWins}
            circle={{ player: "Aurore", absolute: true }}
          />
          <StatBox
            value={thomasWins}
            circle={{ player: "Thomas", absolute: true }}
          />
        </div>
      </div>

      <h2 tabIndex={-1}>Last plays</h2>

      {game.sessions.slice(0, LIMIT_PLAYS).map((session) => (
        <SessionCard session={session} refresh={refresh} />
      ))}

      <h2 tabIndex={-1}>Scores Aurore</h2>

      <div className="stat-box-container centered" tabIndex={-1}>
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

      <h2 tabIndex={-1}>Scores Thomas</h2>

      <div
        className="stat-box-container centered margin-bottom-80"
        tabIndex={-1}
      >
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

      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/game/${id}/add-session`)}
        className="fab"
      >
        <PlayingCardIcon />
      </div>

      <FooterNav />
    </>
  );
}

export default GameDetail;
