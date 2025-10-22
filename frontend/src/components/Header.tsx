import LogoutButton from "./LogoutButton";
import logo from "../assets/logo.jpg";
import homeImage from "../assets/home-header.gif";
import StatBox from "./ui/StatBox";

function Header({ title, isHome }: { title?: string; isHome?: boolean }) {
  if (isHome) {
    return (
      <>
        <div className="logo-home-container">
          <img alt="logo" src={homeImage} className="logo-home" />

          <div className="stat-box-container relative-bottom">
            <StatBox value={6} label="This month" />
            <StatBox value={4} circle={{ player: "Aurore", absolute: true }} />
            <StatBox value={2} circle={{ player: "Thomas", absolute: true }} />
          </div>
        </div>
      </>
    );
  }

  return (
    <header>
      <img alt="logo" src={logo} className="logo" />
      <h2>{title ?? "Game Winner"}</h2>
      <LogoutButton />
    </header>
  );
}

export default Header;
