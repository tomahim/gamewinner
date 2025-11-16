import { getFunctions, httpsCallable } from 'firebase/functions';

const AdminPage = () => {
  const triggerBackup = async () => {
    const functions = getFunctions();
    const backupFirestore = httpsCallable(functions, 'backupFirestore');
    try {
      const result = await backupFirestore();
      const backupData = result.data.backupData;
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
      <button onClick={triggerBackup}>Backup Firestore</button>
    </div>
  );
};

export default AdminPage;
