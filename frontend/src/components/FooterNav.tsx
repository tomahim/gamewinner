import { useNavigate, useLocation } from "react-router-dom";

function FooterNav() {
  const navigate = useNavigate();

  const { pathname: location } = useLocation();

  const currentYear = new Date().getFullYear();
  const isOnStatsPage =
    location.includes("/stats") && !location.includes("/history");
  const isOnHistoryPage = location.includes("/history");
  const isOnHomePage = location.includes("/home") || location.endsWith("/");

  return (
    <div className="bottom-nav">
      <div
        role="button"
        tabIndex={0}
        className={"nav-item material-icons " + (isOnHomePage ? "active" : "")}
        onClick={() => {
          navigate("/home");
        }}
      >
        grid_view
      </div>
      <div
        className={"nav-item material-icons " + (isOnStatsPage ? "active" : "")}
        role="button"
        tabIndex={0}
        onClick={() => {
          navigate(`/stats`);
        }}
      >
        bar_chart
      </div>
      <div
        className={
          "nav-item material-icons " + (isOnHistoryPage ? "active" : "")
        }
        role="button"
        tabIndex={0}
        onClick={() => {
          navigate(`/history/${currentYear}`);
        }}
      >
        history
      </div>
    </div>
  );
}

export default FooterNav;
