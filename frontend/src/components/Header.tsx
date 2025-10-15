import LogoutButton from "./LogoutButton";
import logo from "../assets/logo.jpg";
import homeImage from "../assets/home-header.gif";

function Header({ title, isHome }: { title?: string; isHome?: boolean }) {
  if (isHome) {
    return (
      <>
        <div className="logo-home-container">
          <img alt="logo" src={homeImage} className="logo-home" />
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
