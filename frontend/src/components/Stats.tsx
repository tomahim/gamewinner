import { useGamesList } from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import Loader from "./ui/Loader";

function Stats() {
  const { games, loading } = useGamesList();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header title="Stats" />

      {games.length}

      <FooterNav />
    </>
  );
}

export default Stats;
