// Import Firebase config and Firebase services
import { app } from "./firebaseConfig.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Initialize Firebase Auth
const auth = getAuth(app);

// Function to handle sign-in
function signIn() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, username + "@example.com", password)
        .then(userCredential => {
            window.location.href = "home.html";
        })
        .catch(error => alert(error.message));
}

// Attach signIn to window object so it's accessible globally
window.signIn = signIn;
