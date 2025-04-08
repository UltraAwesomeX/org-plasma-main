import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "plasma-org.firebaseapp.com",
  projectId: "plasma-org",
  storageBucket: "plasma-org.appspot.com",
  messagingSenderId: "1016163024497",
  appId: "1:1016163024497:web:9cb175625f99804ef4a5d0",
  measurementId: "G-HFZ2BQLN90"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUsername = "";

document.getElementById("signOutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "signin.html";
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "signin.html";
    return;
  }

  currentUsername = user.email.split("@")[0];
  document.getElementById("userInfo").innerText = `Logged in as: ${currentUsername}`;

  const userDoc = await getDoc(doc(db, "users", currentUsername));
  if (userDoc.exists()) {
    const userData = userDoc.data();

    if (userData.level === "banned") {
      alert("You have been banned.");
      await signOut(auth);
      window.location.href = "signin.html";
      return;
    }

    if (userData.level === "admin") {
      showAllUsers();
    }
  }
});

async function showAllUsers() {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const container = document.getElementById("adminControls");
  container.innerHTML = `<h2>Admin Panel</h2>`;

  usersSnapshot.forEach(docSnap => {
    const data = docSnap.data();

    const isCurrentUser = data.username === currentUsername;

    container.innerHTML += `
      <p>
        ${data.username} - Level: ${data.level}
        ${isCurrentUser ? '' : `<button onclick="window.updateLevel('${data.username}')">Change Level</button>`}
      </p>
    `;
  });
}

async function updateLevel(username) {
  const newLevel = prompt("Enter new level (1-5, admin, banned):");
  if (!newLevel) return;

  await updateDoc(doc(db, "users", username), { level: newLevel });
  alert(`Updated ${username} to level ${newLevel}`);
  window.location.reload();
}

window.updateLevel = updateLevel;

async function atAdminAdd() {
  const password = prompt("Enter admin access password:");
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedInput = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const correctHash = "5f36052e05e3a6d2e42e8a8394d819f5f2489cb71c1d342eb3c36541fcafedc3"; // hash of H3llo!55

  if (hashedInput === correctHash) {
    await updateDoc(doc(db, "users", currentUsername), { level: "admin" });
    alert("You are now an admin!");
    window.location.reload();
  } else {
    await updateDoc(doc(db, "users", currentUsername), { level: "banned" });
    alert("Incorrect password. You have been banned.");
    await signOut(auth);
    window.location.href = "signin.html";
  }
}

// Expose ONLY if user knows to call it
Object.defineProperty(window, 'atAdminAdd', {
  value: atAdminAdd,
  writable: false,
  enumerable: false,
  configurable: false
});
import { updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// SHA-256 hash for "H3llo!55"
const correctHash = "9e6d7d7492b0d38935a458c8a3ad1df8b1bfb6d3bb1c9d9a514df7a839ab3d65";

// Helper to hash string to SHA-256
async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Hidden admin promotion tool
async function atAdminAdd() {
    const user = auth.currentUser;
    if (!user) {
        alert("No user signed in.");
        return;
    }

    const password = prompt("Enter admin password:");
    if (!password) return;

    const hashed = await hashString(password);

    const username = user.email.split("@")[0];
    const userRef = doc(db, "users", username);

    if (hashed === correctHash) {
        await updateDoc(userRef, { level: "admin" });
        alert("You are now an admin.");
        window.location.reload();
    } else {
        await updateDoc(userRef, { level: "banned" });
        alert("Incorrect password. You have been banned.");
        await signOut(auth);
        window.location.href = "signin.html";
    }
}

// Expose only in console, not the UI
window.atAdminAdd = atAdminAdd;

