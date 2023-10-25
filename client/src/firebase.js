// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-59772.firebaseapp.com",
  projectId: "real-estate-59772",
  storageBucket: "real-estate-59772.appspot.com",
  messagingSenderId: "1058890538445",
  appId: "1:1058890538445:web:730d2b7a478c8cf972f884",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
