import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import FooterNav from "./FooterNav";
import FormButton from "./forms/FormButton";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "./ui/Loader";
import { useGameSessionFromParams } from "../data/GamesListContext";
import DatePicker from "react-datepicker";
import DeleteButton from "./forms/DeleteButton";

type WinnerType = "Thomas" | "Aurore" | "Tie" | "";

function EditSession() {
  const navigate = useNavigate();
  const { loading, game, gameId, session, refresh } =
    useGameSessionFromParams();

  const [winner, setWinner] = useState<WinnerType>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [scoreThomas, setScoreThomas] = useState<number | "">("");
  const [scoreAurore, setScoreAurore] = useState<number | "">("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fill default value when editing
  useEffect(() => {
    if (session) {
      const { date, scoreThomas, scoreAurore, winner } = session;
      setSelectedDate(date);
      setScoreThomas(scoreThomas);
      setScoreAurore(scoreAurore);
      setWinner(winner);
    }
  }, [session]);

  // Automatically set winner based on scores
  useEffect(() => {
    if (scoreThomas !== undefined && scoreAurore !== undefined) {
      if (scoreThomas == scoreAurore) {
        setWinner("Tie");
      } else {
        setWinner(scoreThomas > scoreAurore ? "Thomas" : "Aurore");
      }
    }
  }, [scoreThomas, scoreAurore]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;
    setErrorMessage("");

    if (scoreThomas === "" || scoreAurore === "") {
      setErrorMessage("Please enter both scores.");
      valid = false;
    }

    if (winner === "") {
      setErrorMessage("Please select a winner.");
      valid = false;
    }

    if (!selectedDate) {
      setErrorMessage("Please select a date.");
      valid = false;
    }

    if (valid) {
      try {
        const params = {
          game: { id: gameId },
          date: selectedDate,
          scoreThomas,
          scoreAurore,
          winner: winner,
        };
        if (session) {
          const docRef = doc(db, "sessions", session.id);
          await updateDoc(docRef, params);
        } else {
          await addDoc(collection(db, "sessions"), params);
        }
        refresh();
        navigate(-1);
      } catch (error) {
        setErrorMessage("Error saving session. " + (error as Error).message);
      }
    }
  };

  const handleDelete = async (sessionId: string) => {
    try {
      const docRef = doc(db, "sessions", sessionId);
      await deleteDoc(docRef);
      refresh();
      navigate(-1);
    } catch (error) {
      setErrorMessage("Error deleting session. " + (error as Error).message);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Header title={game?.name ?? ""} />
      <h2 tabIndex={-1}>{session ? "Edit result" : "Add result"}</h2>
      <br />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="form-container">
        <form onSubmit={handleSave}>
          <DatePicker
            placeholderText="Select date"
            dateFormat="dd/MM/yyyy"
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
          />
          <input
            type="number"
            placeholder="Thomas' score"
            value={scoreThomas}
            onChange={(e) =>
              setScoreThomas(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
          <input
            type="number"
            placeholder="Aurore's score"
            value={scoreAurore}
            onChange={(e) =>
              setScoreAurore(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
          <select
            title="Winner"
            value={winner}
            onChange={(e) => setWinner(e.target.value as WinnerType)}
            required
          >
            <option value="" disabled>
              Select winner
            </option>
            <option id="Thomas">Thomas</option>
            <option id="Aurore">Aurore</option>
            <option id="Tie">Tie</option>
          </select>
          <FormButton label={session ? "Edit" : "Add"} />
          {session && <DeleteButton onClick={() => handleDelete(session.id)} />}
        </form>
      </div>
      <FooterNav />
    </>
  );
}

export default EditSession;
