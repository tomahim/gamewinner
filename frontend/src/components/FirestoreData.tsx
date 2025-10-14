import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from './firebase.config';

const FirestoreData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const querySnapshot = await getDocs(collection(db, "YOUR_COLLECTION"));
        const dataList = querySnapshot.docs.map(doc => doc.data());
        setData(dataList);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Firestore Data</h2>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default FirestoreData;
