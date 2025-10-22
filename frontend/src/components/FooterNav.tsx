import { useNavigate } from "react-router-dom";

function FooterNav() {
  const navigate = useNavigate();
  return (
    <div className="bottom-nav">
      <div
        className="nav-item active material-icons"
        onClick={() => {
          navigate("/home");
        }}
      >
        grid_view
      </div>
      <div
        className="nav-item material-icons"
        onClick={() => {
          navigate("/stats");
        }}
      >
        bar_chart
      </div>
      <div
        className="nav-item material-icons"
        onClick={() => {
          navigate("/history");
        }}
      >
        history
      </div>
    </div>
  );
}

export default FooterNav;
