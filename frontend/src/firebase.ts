import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCfnaq0KTXOpe7zEQTW2z2_7pDK_jef8dM",
  authDomain: "gamewinner-22449078-313c0.firebaseapp.com",
  projectId: "gamewinner-22449078-313c0",
  storageBucket: "gamewinner-22449078-313c0.firebasestorage.app",
  messagingSenderId: "496026630711",
  appId: "1:496026630711:web:e5c62d7009b2c73123ddb2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
