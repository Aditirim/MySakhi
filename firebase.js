import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA_SJGywP30S7iYiN5Z4cc3KkP36eLBmYk",
  authDomain: "mysakhi.firebaseapp.com",
  projectId: "mysakhi",
  storageBucket: "mysakhi.appspot.com",
  messagingSenderId: "600130290713",
  appId: "1:600130290713:android:9a9bc4082f35208e389688",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
