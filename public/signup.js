import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHdlyZflixH4JL_t6HypG9wydVbbJ_CnU",
  authDomain: "plasma-org.firebaseapp.com",
  projectId: "plasma-org",
  storageBucket: "plasma-org.appspot.com",
  messagingSenderId: "1016163024497",
  appId: "1:1016163024497:web:9cb175625f99804ef4a5d0",
  measurementId: "G-HFZ2BQLN90"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

async function signUp() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if (!validatePassword(password)) {
    alert("Password must be at least 8 characters long, include an uppercase letter, lowercase letter, number, and a special character.");
    return;
  }

  const email = username + "@example.com";

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Determine user level
    let level = "1";
    if (username === "admin") {
      const enteredPass = prompt("Enter admin password:");
      const encoder = new TextEncoder();
      const data = encoder.encode(enteredPass);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const correctHash = "5f36052e05e3a6d2e42e8a8394d819f5f2489cb71c1d342eb3c36541fcafedc3"; // H3llo!55

      if (hashHex !== correctHash) {
        // Incorrect password: ban the user and delete the Firebase Auth user
        await deleteUser(user);
        alert("Incorrect admin password. Account not created.");
        return;
      }

      level = "admin";
    }

    await setDoc(doc(db, "users", username), {
      username: username,
      level: level
    });

    alert("Account created successfully!");
    window.location.href = "home.html";

  } catch (error) {
    alert("Error: " + error.message);
  }
}

window.signUp = signUp;
