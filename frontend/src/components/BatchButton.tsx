import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../firebase.config";

type ImportedSession = {
  game: { id: string };
  scoreAurore: number;
  scoreThomas: number;
  date: string | number | Date;
  winner: string;
};

function BatchButton() {
  const handleBatch = () => async (e: React.MouseEvent) => {
    e.preventDefault();
    const BATCH_LIMIT = 500;

    try {
      const { default: sessionsToImport } = (await import(
        "../data/011025-data.json"
      )) as { default: ImportedSession[] };

      if (!Array.isArray(sessionsToImport) || sessionsToImport.length === 0) {
        alert("No sessions to import.");
        return;
      }

      const sessionsCollection = collection(db, "sessions");
      let batch = writeBatch(db);
      let writesInBatch = 0;
      let imported = 0;
      let skipped = 0;

      for (let index = 0; index < sessionsToImport.length; index++) {
        const session = sessionsToImport[index];
        try {
          const date = new Date(session.date);
          const sessionPayload = {
            game: session.game,
            scoreAurore: session.scoreAurore,
            scoreThomas: session.scoreThomas,
            winner: session.winner,
            date,
          };

          const docRef = doc(sessionsCollection);
          batch.set(docRef, sessionPayload);
          writesInBatch += 1;
          imported += 1;

          if (writesInBatch === BATCH_LIMIT) {
            await batch.commit();
            batch = writeBatch(db);
            writesInBatch = 0;
          }
        } catch (error) {
          console.warn("Skipping session at index", index, error);
          skipped += 1;
        }
      }

      if (writesInBatch > 0) {
        await batch.commit();
      }

      const messageParts = [`Imported ${imported} sessions.`];
      if (skipped > 0) {
        messageParts.push(`${skipped} entries were skipped due to errors.`);
      }
      alert(messageParts.join(" "));
    } catch (error) {
      console.error("Batch import failed:", error);
      alert("Batch import failed. Check console for details.");
    }
  };

  return <button onClick={handleBatch()}>Batch</button>;
}

export default BatchButton;
