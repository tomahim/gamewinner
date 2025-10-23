import logo from "../assets/logo.jpg";
import homeImage from "../assets/home-header.gif";
import StatBox from "./ui/StatBox";
import { useNavigate } from "react-router-dom";
import {
  useYearsWithStats,
  type AggregatedStats,
  type YearStats,
} from "../data/GamesListContext";

function getCurrentMonthStats(yearsStats: YearStats[]): AggregatedStats {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const year = yearsStats.find((y) => y.year === currentYear);
  const month = year?.months.find((m) => m.month === currentMonth);
  return (
    month || {
      totalPlays: 0,
      auroreWins: 0,
      thomasWins: 0,
      playCounts: [],
    }
  );
}

function Header({ title, isHome }: { title?: string; isHome?: boolean }) {
  const navigate = useNavigate();
  const { yearsStats } = useYearsWithStats();
  const { totalPlays, auroreWins, thomasWins } =
    getCurrentMonthStats(yearsStats);
  if (isHome) {
    const currentDate = new Date();
    const shortMonth =
      currentDate.toLocaleString("default", { month: "short" }) + ".";
    return (
      <>
        <div className="logo-home-container" tabIndex={-1}>
          <img alt="logo" src={homeImage} className="logo-home" />

          <div
            className="stat-box-container relative-bottom"
            onClick={() =>
              navigate(
                "/history/" +
                  currentDate.getFullYear() +
                  "/" +
                  currentDate.getMonth()
              )
            }
          >
            <StatBox value={totalPlays} label={shortMonth + " plays"} />
            <StatBox
              value={auroreWins}
              circle={{ player: "Aurore", absolute: true }}
            />
            <StatBox
              value={thomasWins}
              circle={{ player: "Thomas", absolute: true }}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <header>
      <div
        role="button"
        tabIndex={0}
        className="material-icons back-button"
        onClick={() => navigate(-1)}
      >
        arrow_back
      </div>
      <img alt="logo" src={logo} className="logo" tabIndex={-1} />
      <h2 className="page-title" tabIndex={-1}>
        {title ?? "Game Winner"}
      </h2>
    </header>
  );
}

export default Header;
