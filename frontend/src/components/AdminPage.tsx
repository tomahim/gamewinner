import { getFirestore, collection, getDocs } from 'firebase/firestore';
import BatchButton from './BatchButton'; // Import the new component

const AdminPage = () => {
  // Replace this with a list of your actual collection names  
  const collectionNames = ["games", "sessions"];

  const triggerBackup = async () => {
    try {
      const db = getFirestore();
      const backupData: { [key: string]: { [docId: string]: unknown } } = {};

      for (const collectionName of collectionNames) {
        backupData[collectionName] = {};
        const querySnapshot = await getDocs(collection(db, collectionName));
        for (const doc of querySnapshot.docs) {
          backupData[collectionName][doc.id] = doc.data();
        }
      }

      const json = JSON.stringify(backupData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `firestore-backup-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Backup successful!');
    } catch (error) {
      console.error(error);
      alert('Backup failed. See console for details.');
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Only visible to thimblot@gmail.com</p>
      
      {/* Backup Section */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Export to Backup File</h3>
        <button onClick={triggerBackup}>Backup Firestore</button>
      </div>

      {/* Import Section */}
      <BatchButton />
    </div>
  );
};

export default AdminPage;
