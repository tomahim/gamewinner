import { useNavigate } from "react-router-dom";
import type { GameSession } from "../data/GamesListContext";
import "./SessionCard.scss";
import ImageCircle from "./ui/ImageCircle";

function SessionCard({
  session,
  displayGameName = false,
  refresh,
}: {
  session: GameSession;
  displayGameName?: boolean;
  refresh: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div key={session.id} className="session-card">
      <ImageCircle player={session.winner} />
      <div tabIndex={-1}>
        {session.date.toLocaleDateString("fr-FR")} -{" "}
        {displayGameName && <strong>{session.game.name} - </strong>}
        {session.winner === "Aurore"
          ? session.scoreAurore
          : session.scoreThomas}{" "}
        -{" "}
        {session.winner === "Aurore"
          ? session.scoreThomas
          : session.scoreAurore}
      </div>
      <div
        className="edit-icon material-icons"
        onClick={() => {
          refresh();
          navigate(`/game/${session.game.id}/session/${session.id}`);
        }}
      >
        edit
      </div>
    </div>
  );
}

export default SessionCard;
