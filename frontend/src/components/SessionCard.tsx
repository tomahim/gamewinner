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
      <div className="image-circle">
        {session.winner === "Aurore" && (
          <img
            src="https://t4.ftcdn.net/jpg/12/42/71/23/360_F_1242712312_rKSLexYtzbBcMVhVjUSP4MMxuHq6xgmu.jpg"
            alt="Icon"
          />
        )}

        {session.winner === "Thomas" && (
          <img
            src="https://www.bornfree.org.uk/wp-content/uploads/2023/10/Baby-elephant-c-Diana-Robinson-Getty-Images-1292x1081.jpg"
            alt="Icon"
          />
        )}
      </div>
      <div>
        {session.date.toLocaleDateString("fr-FR")} - Score:{" "}
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
