import React, { createContext, useContext, useState, useEffect } from "react";
import { db, auth } from "../firebase.config"; // Adjust the import based on your Firebase setup
import { getDocs, collection } from "firebase/firestore";

export interface GameSession {
  id: string;
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

// GamesList Provider component
export const GamesListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const gamesQuery = await getDocs(collection(db, "games"));
          const gamesResults = gamesQuery.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as unknown as Game[];

          const sessionsQuery = await getDocs(collection(db, "sessions"));
          const sessionsResults = sessionsQuery.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
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
  }, []);

  return (
    <GamesListContext.Provider value={{ games, loading }}>
      {children}
    </GamesListContext.Provider>
  );
};
