import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config';
import Login from './components/Login';
import FirestoreData from './components/FirestoreData';
import "./App.scss";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="app">
      {user ? <FirestoreData /> : <Login />}
    </div>
  );
}

export default App;
