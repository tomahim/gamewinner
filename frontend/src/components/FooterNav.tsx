import { useNavigate, useLocation } from "react-router-dom";
import { useGamesList, useYearsWithStats } from "../data/GamesListContext";
import { useMemo } from "react";
import { computeBadges } from "../data/badges.compute";
import type { BadgeComputationContext } from "../data/badges.types";
import { useAuth } from "../auth/AuthContext";

function FooterNav() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.email === "thimblot@gmail.com";

  const { pathname: location } = useLocation();
  const { years } = useYearsWithStats();
  const { games } = useGamesList();
  const sessions = useMemo(() => games.flatMap((game) => game.sessions ?? []), [games]);
  const computationContext: BadgeComputationContext = useMemo(
    () => ({ games, sessions, years }),
    [games, sessions, years]
  );
  const badgeCollections = useMemo(() => computeBadges(computationContext), [computationContext]);
  const computedNewBadges =
    badgeCollections.recentCounts.my + badgeCollections.recentCounts.opponent;
  const totalNewBadges = computedNewBadges > 0 ? computedNewBadges : 7;

  const currentYear = new Date().getFullYear();
  const isOnStatsPage =
    location.includes("/stats") && !location.includes("/history");
  const isOnHistoryPage = location.includes("/history");
  const isOnHomePage = location.includes("/home") || location.endsWith("/");
  const isOnBadgesPage = location.includes("/badges") || location.includes("/badge/");
  const isOnAdminPage = location.includes("/admin");

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
      {isAdmin && (
        <div
          className={`nav-item ${isOnAdminPage ? "active" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => {
            navigate(`/admin`);
          }}
        >
          <span className="material-icons nav-item__icon">admin_panel_settings</span>
        </div>
      )}
    </div>
  );
}

export default FooterNav;
