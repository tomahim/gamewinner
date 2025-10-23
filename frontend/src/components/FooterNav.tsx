import { useNavigate } from "react-router-dom";

function FooterNav() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
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
          navigate(`/stats`);
        }}
      >
        bar_chart
      </div>
      <div
        className="nav-item material-icons"
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
