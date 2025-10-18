import Login from "./components/Login";
import "./App.scss";
import { AuthProvider } from "./auth/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GamesList from "./components/GamesList";
import ProtectedRoute from "./auth/ProtectedRoute";
import AddGame from "./components/AddGame";
import GameDetail from "./components/GameDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public route: Login */}
            <Route path="/login" element={<Login />} />

            {/* Protected route: Home, wrapped in ProtectedRoute */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <GamesList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-game"
              element={
                <ProtectedRoute>
                  <AddGame />
                </ProtectedRoute>
              }
            />

            <Route
              path="/game/:id"
              element={
                <ProtectedRoute>
                  <GameDetail />
                </ProtectedRoute>
              }
            />

            {/* Optional: Root redirect based on auth (requires useAuth in a wrapper) */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* Catch-all for unauthorized/404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
