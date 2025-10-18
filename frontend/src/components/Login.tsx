import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import FormButton from "./forms/FormButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home", { replace: true });
    } catch (err) {
      setError("Failed to login");
    }
  };

  return (
    <div className="form-container v-centered">
      <h2>Game winner</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormButton label="Login" />
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
