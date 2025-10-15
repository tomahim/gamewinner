import { useNavigate } from "react-router-dom";

function FooterNav() {
  const navigate = useNavigate();
  return (
    <div className="bottom-nav">
      <div
        className="nav-item active material-icons"
        onClick={() => navigate("/home")}
      >
        grid_view
      </div>
      <div className="nav-item material-icons">play_arrow</div>
      <div className="nav-item material-icons">people</div>
      <div className="nav-item material-icons">whatshot</div>
    </div>
  );
}

export default FooterNav;
