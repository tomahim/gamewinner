import { useGamesList } from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import ImageCircle from "./ui/ImageCircle";
import Loader from "./ui/Loader";

function HistoryCard({
  month,
  winner,
  scoreAurore,
  scoreThomas,
}: {
  month: string;
  winner: "Aurore" | "Thomas" | "Tie";
  scoreAurore: number;
  scoreThomas: number;
}) {
  return (
    <div key={month} className="session-card">
      <ImageCircle player={winner} />
      <div>
        {month} - Score: {winner === "Aurore" ? scoreAurore : scoreThomas} -{" "}
        {winner === "Aurore" ? scoreThomas : scoreAurore}
      </div>
    </div>
  );
}

function YearHistory() {
  const { games, loading } = useGamesList();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header title="History" />

      <h2>2025</h2>

      {games.length}

      <HistoryCard month="March" winner="Tie" scoreAurore={2} scoreThomas={2} />

      <HistoryCard
        month="February"
        winner="Thomas"
        scoreAurore={1}
        scoreThomas={2}
      />

      <HistoryCard
        month="January"
        winner="Aurore"
        scoreAurore={1}
        scoreThomas={2}
      />

      <FooterNav />
    </>
  );
}

export default YearHistory;
