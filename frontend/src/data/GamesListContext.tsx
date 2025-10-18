import React, { createContext, useContext, useState, useEffect } from "react";
import { db, auth } from "../firebase.config"; // Adjust the import based on your Firebase setup
import { getDocs, collection } from "firebase/firestore";

export interface Game {
  id: string;
  name: string;
  imageUrl: string;
}

// Define the shape of the context
interface GamesListContextType {
  games: Game[]; // Replace 'any' with your data type (e.g., Game[])
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
  const [games, setGames] = useState<Game[]>([]); // Replace 'any' with your data type
  const [loading, setLoading] = useState(true);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const querySnapshot = await getDocs(collection(db, "games"));
          const results = querySnapshot.docs.map((doc) => ({
            id: doc.id, // Include the document ID in the data
            ...doc.data(),
          }));
          setGames(results as unknown as Game[]);
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
