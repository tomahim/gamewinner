import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import FooterNav from "./FooterNav";
import FormButton from "./forms/FormButton";
import Header from "./Header";
import { useNavigate, useParams } from "react-router-dom";

function AddSession() {
  const navigate = useNavigate();
  const { id: gameId } = useParams();
  // @ts-ignore
  const [winner, setWinner] = useState<"Thomas" | "Aurore" | undefined>(
    undefined
  );
  // @ts-ignore
  const [scoreThomas, setScoreThomas] = useState<number>(0);
  // @ts-ignore
  const [scoreAurore, setScoreAurore] = useState<number>(0);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "sessions"), {
        game: { id: gameId },
        scoreThomas,
        scoreAurore,
        winner: "Thomas",
      });
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding game.");
    }
  };

  return (
    <>
      <Header title="Add game session" />
      <div className="form-container">
        <form onSubmit={handleSave}>
          <FormButton label="Add" />
        </form>
      </div>
      <FooterNav />
    </>
  );
}

export default AddSession;
