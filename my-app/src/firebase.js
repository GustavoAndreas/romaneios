// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUqzrdMSaGWFxMh_eyU2i1hgXCXmDCuaU",
  authDomain: "romaneios-6614a.firebaseapp.com",
  projectId: "romaneios-6614a",
  storageBucket: "romaneios-6614a.firebasestorage.app",
  messagingSenderId: "717416533918",
  appId: "1:717416533918:web:ebe1ab19aa27efc8c3908f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);