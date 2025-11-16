import {
  collection,
  doc,
  writeBatch,
  getFirestore,
  getDoc,
} from "firebase/firestore";
import React, { useState } from "react";

function BatchButton() {
  const [jsonData, setJsonData] = useState<Record<string, Record<string, any>> | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result;
          if (typeof content === 'string') {
            const parsedData = JSON.parse(content);
            setJsonData(parsedData);
          } else {
            throw new Error("File content could not be read as text.");
          }
        } catch (error) {
          alert("Error parsing JSON file. Please ensure it is a valid JSON file.");
          console.error(error);
          setJsonData(null);
          setFileName("");
        }
      };
      reader.readAsText(file);
    } else {
      setJsonData(null);
      setFileName("");
    }
  };

  const handleImport = async (e: React.MouseEvent) => {
    e.preventDefault();
    const fileInput = document.getElementById('file-input') as HTMLInputElement | null;

    if (!jsonData) {
      alert("Please select a valid JSON file to import.");
      return;
    }

    const dataToImport = jsonData;
    const BATCH_LIMIT = 500;
    const db = getFirestore();

    try {
      let summaryMessage = `File: ${fileName}\n\nThis operation will cause the following changes:\n\n`;
      const stats: Record<string, { new: number; update: number }> = {};
      let totalChanges = 0;

      for (const collectionName in dataToImport) {
        stats[collectionName] = { new: 0, update: 0 };
        const collectionData = dataToImport[collectionName];
        const docIds = Object.keys(collectionData);

        if (docIds.length === 0) continue;

        const docExistencePromises = docIds.map((docId) =>
          getDoc(doc(db, collectionName, docId))
        );
        const docSnapshots = await Promise.all(docExistencePromises);

        docSnapshots.forEach((docSnap) => {
          if (docSnap.exists()) {
            stats[collectionName].update++;
          } else {
            stats[collectionName].new++;
          }
        });

        totalChanges += docIds.length;
        if (stats[collectionName].new > 0 || stats[collectionName].update > 0) {
          summaryMessage += `Collection '${collectionName}':\n`;
          summaryMessage += `  - ${stats[collectionName].new} documents to be created\n`;
          summaryMessage += `  - ${stats[collectionName].update} documents to be updated\n\n`;
        }
      }

      if (totalChanges === 0) {
        alert("The selected file contains no documents to import.");
        return;
      }

      summaryMessage += "Do you want to proceed with the import?";
      const userConfirmed = window.confirm(summaryMessage);

      if (!userConfirmed) {
        alert("Import cancelled.");
        return;
      }

      let batch = writeBatch(db);
      let writesInBatch = 0;
      let importedCount = 0;

      for (const collectionName in dataToImport) {
        const collectionData = dataToImport[collectionName];
        const collectionRef = collection(db, collectionName);

        for (const docId in collectionData) {
          const docData = collectionData[docId];

          if (docData.date && typeof docData.date === 'string') {
            docData.date = new Date(docData.date);
          } else if (docData.date && docData.date.seconds) {
            docData.date = new Date(docData.date.seconds * 1000);
          }

          const docRef = doc(collectionRef, docId);
          batch.set(docRef, docData, { merge: true }); // Use merge:true for upsert
          writesInBatch++;
          importedCount++;

          if (writesInBatch >= BATCH_LIMIT) {
            await batch.commit();
            batch = writeBatch(db);
            writesInBatch = 0;
          }
        }
      }

      if (writesInBatch > 0) {
        await batch.commit();
      }

      alert(`Import complete! Processed ${importedCount} documents from ${fileName}.`);
    } catch (error) {
      console.error("Batch import failed:", error);
      alert("An error occurred during the batch import. Check the console for details.");
    } finally {
      setJsonData(null);
      setFileName("");
      if (fileInput) fileInput.value = "";
    }
  };

  return (
    <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
      <h3>Import from Backup File</h3>
      <input type="file" id="file-input" accept=".json" onChange={handleFileChange} />
      <button onClick={handleImport} disabled={!jsonData} style={{ marginLeft: '10px' }}>
        Import Data
      </button>
    </div>
  );
}

export default BatchButton;
