import React, { createContext, useContext, useState, useEffect } from "react";
import { db, auth } from "../firebase.config"; // Adjust the import based on your Firebase setup
import { getDocs, collection } from "firebase/firestore";
import { useParams } from "react-router-dom";

export interface GameSession {
  id: string;
  date: Date;
  game: { id: string };
  scoreAurore: number;
  scoreThomas: number;
  winner: "Thomas" | "Aurore";
}

export interface Game {
  id: string;
  name: string;
  imageUrl: string;
  sessions: GameSession[];
}

interface GamesListContextType {
  games: Game[];
  loading: boolean;
  refresh: () => void;
}

const GamesListContext = createContext<GamesListContextType | undefined>(
  undefined
);

// Custom hook to use the GamesList context
export const useGamesList = () => {
  const context = useContext(GamesListContext);
  if (!context) {
    throw new Error("useGamesList must be used within a GamesListProvider");
  }
  return context;
};

export const useGameFromParams = () => {
  const { games, loading, refresh } = useGamesList();

  const { id } = useParams<{ id: string }>();

  const game = games.find((g) => g.id === id);

  return { game, id, loading, refresh };
};

export const useGameSessionFromParams = () => {
  const { game, id: gameId, loading, refresh } = useGameFromParams();
  const { sessionId } = useParams<{ id: string; sessionId: string }>();

  const returnValues = {
    game,
    gameId,
    loading,
    refresh,
    session: null,
    sessionId: null,
  };
  if (!sessionId) {
    return returnValues;
  }

  const session = game?.sessions.find((s) => s.id === sessionId);

  return { ...returnValues, session, sessionId };
};

// GamesList Provider component
export const GamesListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTimestamp, setRefreshTimestamp] = useState(
    new Date().getTime()
  );

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const gamesQuery = await getDocs(collection(db, "games"));
          const gamesResults = gamesQuery.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as unknown as Game[];

          const sessionsQuery = await getDocs(collection(db, "sessions"));
          const sessionsResults = sessionsQuery.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            date: doc.data().date.toDate(),
          })) as unknown as GameSession[];
          gamesResults.forEach((game, index) => {
            gamesResults[index].sessions = sessionsResults.filter(
              (session) => session.game.id === game.id
            );
          });
          setGames(gamesResults);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [refreshTimestamp]);

  return (
    <GamesListContext.Provider
      value={{
        games,
        loading,
        refresh: () => setRefreshTimestamp(new Date().getTime()),
      }}
    >
      {children}
    </GamesListContext.Provider>
  );
};
