import { useAuth } from "../auth/AuthContext";

function LogoutButton() {
  const { user, logout } = useAuth();

  if (!user) {
    return <></>;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div onClick={handleLogout} className="filter-icon material-icons">
        logout
      </div>
    </>
  );
}

export default LogoutButton;
