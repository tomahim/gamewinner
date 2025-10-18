import { useState } from "react";
import FooterNav from "./FooterNav";
import FormButton from "./forms/FormButton";
import Header from "./Header";

function AddGame() {
  const [gameName, setGameName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSave = () => {};

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
