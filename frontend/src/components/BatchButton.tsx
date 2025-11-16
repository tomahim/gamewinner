import { doc, writeBatch, getFirestore, getDoc } from "firebase/firestore";
import React, { useState } from "react";

// Helper function for deep object comparison
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;

  if (a instanceof Date && b instanceof Date) {
    return Math.floor(a.getTime() / 1000) === Math.floor(b.getTime() / 1000);
  }

  if (!a || !b || (typeof a !== "object" && typeof b !== "object")) {
    return a === b;
  }

  if (a === null || a === undefined || b === null || b === undefined) {
    return a === b;
  }

  if (a.prototype !== b.prototype) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
};

function BatchButton() {
  const [jsonData, setJsonData] = useState<Record<
    string,
    Record<string, any>
  > | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result;
          if (typeof content === "string") {
            const parsedData = JSON.parse(content);
            setJsonData(parsedData);
          } else {
            throw new Error("File content could not be read as text.");
          }
        } catch (error) {
          alert(
            "Error parsing JSON file. Please ensure it is a valid JSON file."
          );
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
    const fileInput = document.getElementById(
      "file-input"
    ) as HTMLInputElement | null;

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
      const docsToWrite: {
        collectionName: string;
        docId: string;
        docData: any;
      }[] = [];

      for (const collectionName in dataToImport) {
        stats[collectionName] = { new: 0, update: 0 };
        const collectionData = dataToImport[collectionName];
        const docIds = Object.keys(collectionData);

        if (docIds.length === 0) continue;

        const docExistencePromises = docIds.map((docId) =>
          getDoc(doc(db, collectionName, docId))
        );
        const docSnapshots = await Promise.all(docExistencePromises);

        docSnapshots.forEach((docSnap, index) => {
          const docId = docIds[index];
          const docDataFromFile = { ...dataToImport[collectionName][docId] };

          // Convert date fields from string or Firestore timestamp to Date object
          if (
            docDataFromFile.date &&
            typeof docDataFromFile.date === "string"
          ) {
            docDataFromFile.date = new Date(docDataFromFile.date);
          } else if (docDataFromFile.date && docDataFromFile.date.seconds) {
            docDataFromFile.date = new Date(
              docDataFromFile.date.seconds * 1000
            );
          }

          if (docSnap.exists()) {
            const existingDocData = docSnap.data();

            // Also convert date fields from existing data to Date objects for comparison
            if (existingDocData.date && existingDocData.date.toDate) {
              existingDocData.date = existingDocData.date.toDate();
            }

            if (!deepEqual(docDataFromFile, existingDocData)) {
              stats[collectionName].update++;
              docsToWrite.push({
                collectionName,
                docId,
                docData: docDataFromFile,
              });
            }
          } else {
            stats[collectionName].new++;
            docsToWrite.push({
              collectionName,
              docId,
              docData: docDataFromFile,
            });
          }
        });

        totalChanges +=
          stats[collectionName].new + stats[collectionName].update;

        if (stats[collectionName].new > 0 || stats[collectionName].update > 0) {
          summaryMessage += `Collection '${collectionName}':\n`;
          summaryMessage += `  - ${stats[collectionName].new} documents to be created\n`;
          summaryMessage += `  - ${stats[collectionName].update} documents to be updated\n\n`;
        }
      }

      if (totalChanges === 0) {
        alert(
          "The selected file contains no new or modified documents to import."
        );
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

      for (const { collectionName, docId, docData } of docsToWrite) {
        const docRef = doc(db, collectionName, docId);
        batch.set(docRef, docData, { merge: true }); // Use merge:true for upsert
        writesInBatch++;

        if (writesInBatch >= BATCH_LIMIT) {
          await batch.commit();
          batch = writeBatch(db);
          writesInBatch = 0;
        }
      }

      if (writesInBatch > 0) {
        await batch.commit();
      }

      alert(
        `Import complete! Processed ${docsToWrite.length} documents from ${fileName}.`
      );
    } catch (error) {
      console.error("Batch import failed:", error);
      alert(
        "An error occurred during the batch import. Check the console for details."
      );
    } finally {
      setJsonData(null);
      setFileName("");
      if (fileInput) fileInput.value = "";
    }
  };

  return (
    <div
      style={{
        marginTop: "20px",
        borderTop: "1px solid #ccc",
        paddingTop: "20px",
      }}
    >
      <h3>Import from Backup File</h3>
      <input
        type="file"
        id="file-input"
        accept=".json"
        onChange={handleFileChange}
      />
      <button
        onClick={handleImport}
        disabled={!jsonData}
        style={{ marginLeft: "10px" }}
      >
        Import Data
      </button>
    </div>
  );
}

export default BatchButton;
