// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBawzTaUSJah17kngmStn_BBrVYAiMEk84",
	authDomain: "mental-health-rc2021f.firebaseapp.com",
	projectId: "mental-health-rc2021f",
	storageBucket: "mental-health-rc2021f.appspot.com",
	messagingSenderId: "561017948645",
	appId: "1:561017948645:web:a9892b8ba768bc7954470c",
	measurementId: "G-GXXKMD4B3L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();
export const provider = new GoogleAuthProvider();
