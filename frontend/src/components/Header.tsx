import logo from "../assets/logo.jpg";
import homeImage from "../assets/home-header.gif";
import StatBox from "./ui/StatBox";
import { useNavigate } from "react-router-dom";

function Header({ title, isHome }: { title?: string; isHome?: boolean }) {
  const navigate = useNavigate();
  if (isHome) {
    const currentDate = new Date();
    const shortMonth =
      currentDate.toLocaleString("default", { month: "short" }) + ".";
    return (
      <>
        <div className="logo-home-container" tabIndex={-1}>
          <img alt="logo" src={homeImage} className="logo-home" />

          <div className="stat-box-container relative-bottom">
            <StatBox value={6} label={shortMonth} />
            <StatBox value={4} circle={{ player: "Aurore", absolute: true }} />
            <StatBox value={2} circle={{ player: "Thomas", absolute: true }} />
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
