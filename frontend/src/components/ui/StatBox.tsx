import ImageCircle from "./ImageCircle";
import "./StatBox.scss";

function StatBox({
  value = 0,
  label,
  circle,
}: {
  value: number;
  label?: string;
  circle?: {
    player: "Thomas" | "Aurore";
    absolute: boolean;
  };
}) {
  return (
    <div className="stat-box" tabIndex={-1}>
      {label && <span className="number">{value}</span>}
      {label && <span className="text">{label}</span>}
      {circle && (
        <ImageCircle player={circle.player} absolute={circle.absolute} />
      )}
      {!label && circle && <span className="number-bottom">{value}</span>}
    </div>
  );
}

export default StatBox;
