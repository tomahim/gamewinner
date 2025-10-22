import { useNavigate } from "react-router-dom";
import type { GameSession } from "../data/GamesListContext";

function SessionCard({
  session,
  refresh,
}: {
  session: GameSession;
  refresh: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div key={session.id}>
      {session.winner}
      <span
        className="material-icons"
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
