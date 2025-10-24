import { useState } from "react";
import "./SearchBar.scss";
import type { Game } from "../../data/GamesListContext";

export function sortByRecentlyPlayed(games: Game[]): Game[] {
  return games.slice().sort((a, b) => {
    if (a.lastSession === null && b.lastSession === null) {
      return 0;
    }
    if (a.lastSession === null) {
      return 1;
    }
    if (b.lastSession === null) {
      return -1;
    }
    return b.lastSession.getTime() - a.lastSession.getTime();
  });
}

export function sortByMostPlayed(games: Game[]) {
  return games.slice().sort((a, b) => {
    return (b.sessions?.length ?? 0) - (a.sessions?.length ?? 0);
  });
}

function SearchBar({
  setSearchQuery,
  sortOptions,
  sortOption,
  setSortOption,
}: {
  sortOptions: string[];
  sortOption: string;
  setSearchQuery: (query: string) => void;
  setSortOption: (query: string) => void;
}) {
  const [openSort, setOpenSort] = useState(false);

  return (
    <div className="search-bar">
      <div className="search-input">
        <span className="material-icons search-input__icon">search</span>
        <input
          placeholder="Search a game"
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="search-sort" tabIndex={-1}>
        <button
          className="search-sort__trigger"
          onClick={() => setOpenSort(!openSort)}
        >
          <span className="material-icons">sort</span>
          {sortOption}
          <span className="material-icons caret">expand_more</span>
        </button>
        {openSort && (
          <div className="search-sort__dropdown">
            <ul>
              {sortOptions &&
                sortOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setSortOption(option);
                      setOpenSort(false);
                    }}
                    className={sortOption === option ? "active" : ""}
                  >
                    {option}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
