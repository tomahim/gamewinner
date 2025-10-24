import { useState } from "react";
import "./SearchBar.scss";
import type { Game } from "../../data/GamesListContext";

export function sortByRecentlyPlayed(games: Game[]): Game[] {
  return games.slice().sort((a, b) => {
    // If both lastSession are null, consider them equal
    if (a.lastSession === null && b.lastSession === null) {
      return 0;
    }
    // If a.lastSession is null, a goes to the end
    if (a.lastSession === null) {
      return 1;
    }
    // If b.lastSession is null, b goes to the end
    if (b.lastSession === null) {
      return -1;
    }
    // Both have valid dates, sort by most recent
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
      <div className="search-wrapper">
        <input
          placeholder="Search"
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>
        <span className="material-icons search-icon">search</span>
      </div>
      <div className="sort-options" tabIndex={-1}>
        <div className="material-icons" onClick={() => setOpenSort(!openSort)}>
          sort
        </div>
        {openSort && (
          <div className="sort-dropdown">
            <ul>
              {sortOptions &&
                sortOptions.map((option) => (
                  <li
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
