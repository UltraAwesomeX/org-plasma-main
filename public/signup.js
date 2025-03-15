// Import Firebase configuration and modules
import { app, auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Function to validate passwords
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// Function to handle sign-up
async function signUp() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (!validatePassword(password)) {
        alert("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, username + "@example.com", password);
        await setDoc(doc(db, "users", username), {
            username: username,
            level: username === "admin" ? "admin" : 1
        });

        alert("Account created!");
    } catch (error) {
        alert(error.message);
    }
}

// Attach signUp to the window object so it's globally accessible
window.signUp = signUp;
