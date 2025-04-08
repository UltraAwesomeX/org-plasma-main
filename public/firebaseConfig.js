// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAHdlyZflixH4JL_t6HypG9wydVbbJ_CnU",
    authDomain: "plasma-org.firebaseapp.com",
    projectId: "plasma-org",
    storageBucket: "plasma-org.appspot.com",
    messagingSenderId: "1016163024497",
    appId: "1:1016163024497:web:9cb175625f99804ef4a5d0",
    measurementId: "G-HFZ2BQLN90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };