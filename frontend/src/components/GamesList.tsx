import { useGamesList, type Game } from "../data/GamesListContext";
import FooterNav from "./FooterNav";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import Loader from "./ui/Loader";
import { useEffect, useState } from "react";
import SearchBar, {
  sortByMostPlayed,
  sortByRecentlyPlayed,
} from "./ui/SearchBar";
import noGame from "../assets/nogame.jpg";

function GameCard({ game }: { game: Game }) {
  const navigate = useNavigate();
  const { id, imageUrl, name, sessions } = game;
  return (
    <div onClick={() => navigate(`/game/${id}`)} className="game-card">
      <img src={imageUrl} alt="game" />
      <div className="rank-tag">
        {sessions?.length ?? 0} play{sessions?.length > 1 ? "s" : ""}
      </div>
      <div className="game-name">{name}</div>
    </div>
  );
}

function GamesList() {
  const { games, loading } = useGamesList();

  const [searchQuery, setSearchQuery] = useState("");
  const sortOptions = ["Recent play", "Most played"];
  const [sortOption, setSortOption] = useState(sortOptions[0]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  useEffect(() => {
    let sortedGames: Game[] = [];
    if (sortOption === "Most played") {
      sortedGames = sortByMostPlayed(games);
    } else if (sortOption === "Recent play") {
      sortedGames = sortByRecentlyPlayed(games);
    }

    if (searchQuery === "") {
      setFilteredGames(sortedGames);
      return;
    }

    setFilteredGames(
      sortedGames.filter((game) =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, sortOption, games]);

  const navigate = useNavigate();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header isHome={true} />

      <h2 className="section-title">Our games ({filteredGames.length})</h2>

      <SearchBar
        setSearchQuery={setSearchQuery}
        sortOptions={sortOptions}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <div className="game-grid">
        {filteredGames.length ? (
          filteredGames.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <div className="no-data-container">
            <img src={noGame} alt="No game found" className="no-data-image" />
          </div>
        )}
      </div>

      <div onClick={() => navigate("/add-game")} className="fab material-icons">
        add
      </div>

      <FooterNav />
    </>
  );
}

export default GamesList;
