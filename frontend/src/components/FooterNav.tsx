import { useNavigate, useLocation } from "react-router-dom";
import { useGamesList, useYearsWithStats } from "../data/GamesListContext";
import { useMemo } from "react";
import { generateMockBadges } from "../data/mockBadges";

function FooterNav() {
  const navigate = useNavigate();

  const { pathname: location } = useLocation();
  const { years } = useYearsWithStats();
  const { games } = useGamesList();
  const mockCollections = useMemo(() => generateMockBadges(years, games), [years, games]);
  const computedNewBadges = mockCollections.recentCounts.my + mockCollections.recentCounts.opponent;
  const totalNewBadges = computedNewBadges > 0 ? computedNewBadges : 7;

  const currentYear = new Date().getFullYear();
  const isOnStatsPage =
    location.includes("/stats") && !location.includes("/history");
  const isOnHistoryPage = location.includes("/history");
  const isOnHomePage = location.includes("/home") || location.endsWith("/");
  const isOnBadgesPage = location.includes("/badges") || location.includes("/badge/");

  return (
    <div className="bottom-nav">
      <div
        role="button"
        tabIndex={0}
        className={`nav-item ${isOnHomePage ? "active" : ""}`}
        onClick={() => {
          navigate("/home");
        }}
      >
        <span className="material-icons nav-item__icon">grid_view</span>
      </div>
      <div
        className={`nav-item ${isOnStatsPage ? "active" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => {
          navigate(`/stats`);
        }}
      >
        <span className="material-icons nav-item__icon">bar_chart</span>
      </div>
      <div
        className={`nav-item ${isOnHistoryPage ? "active" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => {
          navigate(`/history/${currentYear}`);
        }}
      >
        <span className="material-icons nav-item__icon">history</span>
      </div>
      <div
        className={`nav-item nav-item--badges ${isOnBadgesPage ? "active" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => {
          navigate(`/badges`);
        }}
      >
        <span className="material-icons nav-item__icon">military_tech</span>
        {totalNewBadges > 0 && (
          <span className="nav-item__notif">{totalNewBadges}</span>
        )}
      </div>
    </div>
  );
}

export default FooterNav;
