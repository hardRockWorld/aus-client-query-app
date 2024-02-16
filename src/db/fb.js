// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { isEmulating, isProductionEnv } from "@/environment.js";

let firebaseConfig;

// Your web app's Prod Firebase configuration
firebaseConfig = {
  apiKey: "AIzaSyDQlSs2i89Lao4JIKoIGlkhUgGl5mtMhsw",
  authDomain: "aus-client-query-app.firebaseapp.com",
  projectId: "aus-client-query-app",
  storageBucket: "aus-client-query-app.appspot.com",
  messagingSenderId: "288911144936",
  appId: "1:288911144936:web:e0c4f2774b2edbda87965d",
};
// if (isProductionEnv()) {
//     // Your web app's Prod Firebase configuration
//     firebaseConfig = {
//         apiKey: "AIzaSyDQlSs2i89Lao4JIKoIGlkhUgGl5mtMhsw",
//         authDomain: "aus-client-query-app.firebaseapp.com",
//         projectId: "aus-client-query-app",
//         storageBucket: "aus-client-query-app.appspot.com",
//         messagingSenderId: "288911144936",
//         appId: "1:288911144936:web:e0c4f2774b2edbda87965d"
//     };
// } else {
//     // Your web app's Staging Firebase configuration
//     firebaseConfig = {
//         apiKey: "AIzaSyBbGREFhGDgUZFave-_t3sSbNmSJqfU8gM",
//         authDomain: "aus-client-query-app-test.firebaseapp.com",
//         projectId: "aus-client-query-app-test",
//         storageBucket: "aus-client-query-app-test.appspot.com",
//         messagingSenderId: "167218726358",
//         appId: "1:167218726358:web:5890600339aed54a725077"
//     };
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize firestore
const db = getFirestore(app);
if (isEmulating) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
if (isEmulating) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export { db, auth };
