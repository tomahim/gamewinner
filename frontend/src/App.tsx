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
import { GamesListProvider } from "./data/GamesListContext";
import EditSession from "./components/EditSession";
import StatsByPeriod from "./components/StatsByPeriod";
import YearHistory from "./components/YearHistory";
import MonthHistory from "./components/MonthHistory";
import Badges from "./components/Badges";
import BadgeDetail from "./components/BadgeDetail";

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
                  <GamesListProvider>
                    <GamesList />
                  </GamesListProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-game"
              element={
                <ProtectedRoute>
                  <GamesListProvider>
                    <AddGame />
                  </GamesListProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/game/:id"
              element={
                <ProtectedRoute>
                  <GamesListProvider>
                    <GameDetail />
                  </GamesListProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/game/:id/add-session"
              element={
                <ProtectedRoute>
                  <GamesListProvider>
                    <EditSession />
                  </GamesListProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/game/:id/session/:sessionId"
              element={
                <ProtectedRoute>
                  <GamesListProvider>
                    <EditSession />
                  </GamesListProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/stats/:year?/:month?"
              element={
                <ProtectedRoute>
                  <GamesListProvider>
                    <StatsByPeriod />
                  </GamesListProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/history/:year"
              element={
                <ProtectedRoute>
                  <GamesListProvider>
                    <YearHistory />
                  </GamesListProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/history/:year/:month"
              element={
                <ProtectedRoute>
                  <GamesListProvider>
                    <MonthHistory />
                  </GamesListProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/badges"
              element={
                <ProtectedRoute>
                  <GamesListProvider>
                    <Badges />
                  </GamesListProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/badge/:badgeId"
              element={
                <ProtectedRoute>
                  <GamesListProvider>
                    <BadgeDetail />
                  </GamesListProvider>
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
