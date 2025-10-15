import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase.config";

const FirestoreData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const querySnapshot = await getDocs(collection(db, "games"));
        const dataList = querySnapshot.docs.map((doc) => doc.data());
        // @ts-ignore
        setData(dataList);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Firestore Data</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default FirestoreData;
