import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";

const FirestoreData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "games"));
      const dataList = querySnapshot.docs.map((doc) => doc.data());
      setData(dataList);
    };

    fetchData();
  }, []);

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
