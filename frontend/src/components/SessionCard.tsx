import { useNavigate } from "react-router-dom";
import type { GameSession } from "../data/GamesListContext";
import "./SessionCard.scss";

function SessionCard({
  session,
  refresh,
}: {
  session: GameSession;
  refresh: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div key={session.id} className="session-card">
      {session.date.toLocaleDateString("fr-FR")} - Winner: {session.winner}
      <span
        className="edit-icon material-icons"
        onClick={() => {
          refresh();
          navigate(`/game/${session.game.id}/session/${session.id}`);
        }}
      >
        edit
      </span>
    </div>
  );
}

export default SessionCard;
