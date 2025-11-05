import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FooterNav from "./FooterNav";
import Header from "./Header";
import { useGameFromParams } from "../data/GamesListContext";
import Loader from "./ui/Loader";
import PlayingCardIcon from "./ui/PlayingCardIcon";
import SessionCard from "./SessionCard";
import ScoreEvolutionChart from "./ScoreEvolutionChart";
import WinsEvolutionChart from "./WinsEvolutionChart";
import StatBox from "./ui/StatBox";

const LIMIT_PLAYS = 10;
const MINUTES_PER_GAME = 40;

function humanizeMinutes(totalMinutes: number) {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
    return "0 min";
  }

  const minutes = Math.floor(totalMinutes);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  const parts: string[] = [];

  if (days) {
    parts.push(`${days}d`);
  }

  if (remainingHours) {
    parts.push(`${remainingHours}h`);
  }

  if (remainingMinutes) {
    parts.push(`${remainingMinutes}m`);
  }

  if (!parts.length) {
    parts.push("0 min");
  }

  return parts.join(" ");
}

function GameDetail() {
  const navigate = useNavigate();
  const [chartView, setChartView] = useState<"score" | "wins">("score");

  const { game, id, loading, refresh } = useGameFromParams();

  if (loading) return <Loader />;

  if (!game) {
    return <>Game not found.</>;
  }

  const { imageUrl, stats } = game;
  const { totalPlays, thomasWins, auroreWins } = stats;
  const approximatePlaytime = humanizeMinutes(totalPlays * MINUTES_PER_GAME);

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

      <div className="game-meta">
        <span className="material-icons game-meta-icon">schedule</span>
        <span className="game-meta-text">Approx. time playing</span>
        <span className="game-meta-value">{approximatePlaytime}</span>
      </div>

      <h2 tabIndex={-1}>Last plays</h2>

      {game.sessions.slice(0, LIMIT_PLAYS).map((session) => (
        <SessionCard key={session.id} session={session} refresh={refresh} />
      ))}

      <div className="chart-section-header">
        <h2 tabIndex={-1}>
          {chartView === "score" ? "Score evolution" : "Wins evolution"}
        </h2>
        <button
          type="button"
          className="chart-toggle-button"
          onClick={() =>
            setChartView((current) => (current === "score" ? "wins" : "score"))
          }
        >
          {chartView === "score" ? "Wins evolution" : "Score evolution"}
        </button>
      </div>

      {chartView === "score" ? (
        <ScoreEvolutionChart sessions={game.sessions} />
      ) : (
        <WinsEvolutionChart sessions={game.sessions} />
      )}

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

      <div className="stat-box-container centered margin-bottom-80" tabIndex={-1}>
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
