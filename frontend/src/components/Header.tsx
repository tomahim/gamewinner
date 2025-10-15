import LogoutButton from "./LogoutButton";
import logo from "../assets/logo.jpg";

function Header({ title }: { title?: string }) {
  return (
    <header>
      <img alt="logo" src={logo} className="logo" />
      <h2>{title ?? "Game Winner"}</h2>
      <LogoutButton />
    </header>
  );
}

export default Header;
