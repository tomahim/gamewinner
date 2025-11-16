import { getFunctions, httpsCallable } from 'firebase/functions';

const AdminPage = () => {
  const triggerBackup = async () => {
    const functions = getFunctions();
    const backupFirestore = httpsCallable(functions, 'backupFirestore');
    try {
      const result = await backupFirestore();
      console.log(result.data.message);
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
      <button onClick={triggerBackup}>Backup Firestore</button>
    </div>
  );
};

export default AdminPage;
