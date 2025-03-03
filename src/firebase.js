// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOJzqJ8c0RH0ZDknguB0U2n5FdcqqqNZg",
  authDomain: "computadora-18799.firebaseapp.com",
  projectId: "computadora-18799",
  storageBucket: "computadora-18799.firebasestorage.app",
  messagingSenderId: "306877826386",
  appId: "1:306877826386:web:e101114c3a260ee0dc668b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };