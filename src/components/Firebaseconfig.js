import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyA90q1K59TDv_eNb8ZcQh67fD12hrhGU5s",
  authDomain: "fir-fbd32.firebaseapp.com",
  projectId: "fir-fbd32",
  storageBucket: "fir-fbd32.appspot.com",
  messagingSenderId: "426160312732",
  appId: "1:426160312732:web:6f8f40bb2bff32758eb859",
  measurementId: "G-RHBRTZMY19"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
