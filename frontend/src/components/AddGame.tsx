import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import FooterNav from "./FooterNav";
import FormButton from "./forms/FormButton";
import Header from "./Header";

function AddGame() {
  const [gameName, setGameName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "games"), {
        name: gameName,
        imageUrl: imageUrl,
      });
      setGameName("");
      setImageUrl("");
      alert("Game added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding game.");
    }
  };

  return (
    <>
      <Header title="Add game" />
      <div className="form-container">
        <form onSubmit={handleSave}>
          <input
            type="text"
            placeholder="Name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <FormButton label="Add" />
        </form>
      </div>
      <FooterNav />
    </>
  );
}

export default AddGame;
